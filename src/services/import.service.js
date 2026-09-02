import { formatDate } from "@/shared/utils/date.utils";

/**
 * ImportService - Handles data import from various formats
 * This is infrastructure layer - knows about file formats but not UI
 */
export const ImportService = {
  /**
   * Parse imported file content into habits
   * @param {string} content - File content
   * @param {string} format - 'json' | 'markdown' | 'csv'
   * @returns {Array} Array of habit objects
   */
  parse(content, format) {
    switch (format) {
      case "json":
        return this._parseJSON(content);
      case "markdown":
        return this._parseMarkdown(content);
      case "csv":
        return this._parseCSV(content);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  },

  /**
   * Detect format from file name or content
   */
  detectFormat(file) {
    const name = file.name.toLowerCase();
    if (file.type === "application/json" || name.endsWith(".json"))
      return "json";
    if (name.endsWith(".md") || name.endsWith(".markdown")) return "markdown";
    if (file.type === "text/csv" || name.endsWith(".csv")) return "csv";
    return null;
  },

  _parseJSON(content) {
    const data = JSON.parse(content);
    const habits = Array.isArray(data) ? data : data.habits || [];
    if (!Array.isArray(habits) || habits.length === 0) {
      throw new Error("No structured data could be extracted");
    }
    return habits;
  },

  _parseMarkdown(text) {
    const habits = [];
    const blockRegex =
      /## #️⃣ ([^\n]+)\n## 🎯 ([^\n]+)\n([\s\S]*?)(?=\n## #️⃣ |\n*$)/g;

    let match;
    while ((match = blockRegex.exec(text)) !== null) {
      const [, id, name, block] = match;
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      let category = "general";
      let frequency = 7;
      let createdAt = formatDate(new Date());
      let archived = false;
      const completedDates = [];
      const skippedDates = [];
      let currentSection = "completed";

      lines.forEach((line) => {
        if (line === "### 📅 Completion History") {
          currentSection = "completed";
          return;
        }
        if (line === "### 🕒 Skipped Dates") {
          currentSection = "skipped";
          return;
        }
        if (line.includes("- **Category:**")) {
          category = line.split("📁 ")[1]?.trim() || "general";
        } else if (line.includes("- **Frequency:**")) {
          frequency = parseInt(line.split("📅 ")[1]) || 7;
        } else if (line.includes("- **Created At:**")) {
          createdAt = line.split("⏰ ")[1]?.trim() || formatDate(new Date());
        } else if (line.includes("- **Status:**")) {
          archived = line.includes("📦 Archived");
        } else if (/^- \[[ xX]\]/.test(line)) {
          const date = line.replace(/^- \[[ xX]\]\s*/, "").trim();
          if (!date) return;
          if (currentSection === "skipped") skippedDates.push(date);
          else completedDates.push(date);
        }
      });

      habits.push({
        id,
        name,
        category,
        frequency,
        createdAt,
        archived,
        completedDates,
        skippedDates,
      });
    }

    if (habits.length === 0) {
      throw new Error("No structured data could be extracted");
    }
    return habits;
  },

  _parseCSV(text) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length <= 1) throw new Error("No data rows found");

    const habits = lines
      .slice(1)
      .map((line) => {
        const matches =
          line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
        if (matches.length < 5) return null;

        const id = matches[0].replace(/^"|"$/g, "");
        const name = matches[1].replace(/^"|"$/g, "").replace(/""/g, '"');
        const category = matches[2].replace(/^"|"$/g, "");
        const frequency = parseInt(matches[3]) || 7;
        const createdAt = matches[4]
          ? matches[4].replace(/^"|"$/g, "")
          : formatDate(new Date());
        const archived = matches[5]?.replace(/^"|"$/g, "") === "Archived";
        const completedDates = matches[6]
          ? matches[6]
              .replace(/^"|"$/g, "")
              .split(";")
              .map((d) => d.trim())
              .filter((d) => d.length > 0)
          : [];
        const skippedDates = matches[7]
          ? matches[7]
              .replace(/^"|"$/g, "")
              .split(";")
              .map((d) => d.trim())
              .filter((d) => d.length > 0)
          : [];

        return {
          id,
          name,
          category,
          frequency,
          createdAt,
          archived,
          completedDates,
          skippedDates,
        };
      })
      .filter((h) => h !== null);

    if (habits.length === 0) {
      throw new Error("No structured data could be extracted");
    }
    return habits;
  },
};
