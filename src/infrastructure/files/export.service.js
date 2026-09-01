import { formatDate, todayISO } from "@/shared/utils/date.utils";

import { STORAGE_VERSION } from "@/infrastructure/persistence/local-storage.adapter";

/**
 * ExportService - Handles data export in various formats
 * This is infrastructure layer - knows about file formats but not UI
 */
export const ExportService = {
  /**
   * Export habits in specified format
   * @param {Array} habits - Array of habit objects
   * @param {string} format - 'json' | 'markdown' | 'csv'
   * @returns {Object} { content, fileName, contentType }
   */
  export(habits, format = "json") {
    if (!habits || habits.length === 0) {
      throw new Error("No data to export");
    }

    const dateStr = formatDate(new Date());

    switch (format) {
      case "json":
        return this._exportJSON(habits, dateStr);
      case "markdown":
        return this._exportMarkdown(habits, dateStr);
      case "csv":
        return this._exportCSV(habits, dateStr);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  },

  _exportJSON(habits, dateStr) {
    const data = {
      version: STORAGE_VERSION,
      habits: habits,
      exportedAt: todayISO(),
    };
    return {
      content: JSON.stringify(data, null, 2),
      fileName: `Habits_Backup_${dateStr}_v${STORAGE_VERSION}.json`,
      contentType: "application/json",
    };
  },

  _exportMarkdown(habits, dateStr) {
    let content = `# 📊 Habit Tracker Workspace Progress Report\n\n`;
    content += `Generated: ${todayISO()}\n\n`;
    content += `**Storage Version:** ${STORAGE_VERSION}\n\n`;
    content += `---\n\n`;

    habits.forEach((habit) => {
      content += `## #️⃣ ${habit.id}\n`;
      content += `## 🎯 ${habit.name}\n`;
      content += `- **Category:** 📁 ${habit.category}\n`;
      content += `- **Frequency:** 📅 ${habit.frequency} days/wk\n`;
      content += `- **Created At:** ⏰ ${habit.createdAt}\n`;
      content += `- **Status:** ${habit.archived ? "📦 Archived" : "⚡ Active"}\n\n`;

      content += `### 📅 Completion History\n`;
      if (!habit.completedDates || habit.completedDates.length === 0) {
        content += `_No check-ins recorded yet._\n\n`;
      } else {
        habit.completedDates.forEach((d) => {
          content += `- [x] ${d}\n`;
        });
        content += `\n`;
      }

      content += `### 🕒 Skipped Dates\n`;
      if (!habit.skippedDates || habit.skippedDates.length === 0) {
        content += `_No skipped dates recorded yet._\n\n`;
      } else {
        habit.skippedDates.forEach((d) => {
          content += `- [x] ${d}\n`;
        });
        content += `\n`;
      }
      content += `---\n\n`;
    });

    return {
      content,
      fileName: `Habits_Backup_${dateStr}_v${STORAGE_VERSION}.md`,
      contentType: "text/markdown",
    };
  },

  _exportCSV(habits, dateStr) {
    const escapeCsv = (value) => {
      const text = value == null ? "" : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };

    let content = `# VERSION: ${STORAGE_VERSION}\n`;
    content += `Id,Name,Category,Frequency,Created At,Archived,Completed Dates,Skipped Dates\n`;

    habits.forEach((h) => {
      const rows = [
        escapeCsv(h.id),
        escapeCsv(h.name),
        escapeCsv(h.category),
        escapeCsv(h.frequency),
        escapeCsv(h.createdAt),
        escapeCsv(h.archived ? "Archived" : "Active"),
        escapeCsv((h.completedDates || []).join(";")),
        escapeCsv((h.skippedDates || []).join(";")),
      ];
      content += rows.join(",") + "\n";
    });

    return {
      content,
      fileName: `Habits_Backup_${dateStr}_v${STORAGE_VERSION}.csv`,
      contentType: "text/csv;charset=utf-8;",
    };
  },

  /**
   * Download exported data as file
   */
  download(exportResult) {
    const blob = new Blob([exportResult.content], {
      type: exportResult.contentType,
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = exportResult.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  },
};
