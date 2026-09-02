import { ExportService } from "./export.service";
import { ImportService } from "./import.service";

/**
 * FileService - Manages file operations (upload/download)
 * This is a UI service that orchestrates file operations
 */
export const FileService = {
  /**
   * Read file content
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        resolve(event.target.result);
      });
      reader.addEventListener("error", () => {
        reject(new Error("Failed to read file"));
      });
      reader.readAsText(file);
    });
  },

  /**
   * Import data from file
   */
  async importFile(file) {
    const format = ImportService.detectFormat(file);
    if (!format) {
      throw new Error(
        "Invalid format! Only JSON, MD, or CSV files are permitted",
      );
    }

    const content = await this.readFile(file);
    return ImportService.parse(content, format);
  },

  /**
   * Export and download data
   */
  exportData(habits, format) {
    const result = ExportService.export(habits, format);
    ExportService.download(result);
    return result;
  },

  /**
   * Setup dropzone events
   */
  setupDropzone(dropzoneElement, fileInputElement, onFileSelected) {
    if (!dropzoneElement || !fileInputElement) return;

    dropzoneElement.addEventListener("click", () => fileInputElement.click());

    dropzoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzoneElement.classList.add("border-brand/80", "bg-brand/5");
    });

    ["dragleave", "drop"].forEach((event) => {
      dropzoneElement.addEventListener(event, () => {
        dropzoneElement.classList.remove("border-brand/80", "bg-brand/5");
      });
    });

    dropzoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length && onFileSelected) {
        onFileSelected(files[0]);
      }
    });

    fileInputElement.addEventListener("change", (e) => {
      if (e.target.files.length && onFileSelected) {
        onFileSelected(e.target.files[0]);
      }
      // Reset input so same file can be re-uploaded
      e.target.value = "";
    });
  },
};
