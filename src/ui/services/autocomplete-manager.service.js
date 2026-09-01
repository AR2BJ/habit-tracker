import {
  CATEGORY_OPTIONS,
  FREQUENCY_OPTIONS,
} from "@/shared/constants/habit-options.constants";

import { AutocompleteComponent } from "@/components/ui/autocomplete.component";

/**
 * AutocompleteManager - Manages autocomplete instances for habit forms
 */
export const AutocompleteManager = {
  // Create form autocompletes
  createCategoryAutocomplete: null,
  createFrequencyAutocomplete: null,

  // Edit form autocompletes
  editCategoryAutocomplete: null,
  editFrequencyAutocomplete: null,

  /**
   * Setup create form autocompletes
   */
  setupCreateAutocompletes() {
    const categoryWrapper = document.getElementById("create-category-wrapper");
    const frequencyWrapper = document.getElementById(
      "create-frequency-wrapper",
    );

    if (categoryWrapper) {
      this.createCategoryAutocomplete = new AutocompleteComponent(
        categoryWrapper,
        CATEGORY_OPTIONS,
        {
          label: "Category",
          placeholder: "Select Category...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
        },
      );
      this.createCategoryAutocomplete.setValue("general");
    }

    if (frequencyWrapper) {
      this.createFrequencyAutocomplete = new AutocompleteComponent(
        frequencyWrapper,
        FREQUENCY_OPTIONS,
        {
          label: "Days per week",
          placeholder: "Select Days per week...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
        },
      );
      this.createFrequencyAutocomplete.setValue(7);
    }
  },

  /**
   * Setup edit form autocompletes
   * @param {Object} habit - Habit object with category and frequency
   */
  setupEditAutocompletes(habit) {
    this.destroyEditAutocompletes();

    const categoryWrapper = document.getElementById("edit-category-wrapper");
    const frequencyWrapper = document.getElementById("edit-frequency-wrapper");

    if (categoryWrapper) {
      this.editCategoryAutocomplete = new AutocompleteComponent(
        categoryWrapper,
        CATEGORY_OPTIONS,
        {
          label: "Category",
          placeholder: "Select Category...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
        },
      );
      if (habit.category) {
        this.editCategoryAutocomplete.setValue(habit.category);
      }
    }

    if (frequencyWrapper) {
      this.editFrequencyAutocomplete = new AutocompleteComponent(
        frequencyWrapper,
        FREQUENCY_OPTIONS,
        {
          label: "Days per week",
          placeholder: "Select Days per week...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
        },
      );
      if (habit.frequency) {
        this.editFrequencyAutocomplete.setValue(habit.frequency);
      }
    }
  },

  /**
   * Get create form values
   */
  getCreateValues() {
    return {
      category: this.createCategoryAutocomplete?.getValue() || "general",
      frequency: this.createFrequencyAutocomplete?.getValue() || 7,
    };
  },

  /**
   * Get edit form values
   */
  getEditValues() {
    return {
      category: this.editCategoryAutocomplete?.getValue() || "general",
      frequency: this.editFrequencyAutocomplete?.getValue() || 7,
    };
  },

  /**
   * Reset create form
   */
  resetCreateForm() {
    this.createCategoryAutocomplete?.setValue("general");
    this.createFrequencyAutocomplete?.setValue(7);
  },

  /**
   * Destroy create form autocompletes
   */
  destroyCreateAutocompletes() {
    if (this.createCategoryAutocomplete) {
      this.createCategoryAutocomplete.destroy();
      this.createCategoryAutocomplete = null;
    }
    if (this.createFrequencyAutocomplete) {
      this.createFrequencyAutocomplete.destroy();
      this.createFrequencyAutocomplete = null;
    }
  },

  /**
   * Destroy edit form autocompletes
   */
  destroyEditAutocompletes() {
    if (this.editCategoryAutocomplete) {
      this.editCategoryAutocomplete.destroy();
      this.editCategoryAutocomplete = null;
    }
    if (this.editFrequencyAutocomplete) {
      this.editFrequencyAutocomplete.destroy();
      this.editFrequencyAutocomplete = null;
    }
  },

  /**
   * Destroy all autocompletes
   */
  destroy() {
    this.destroyCreateAutocompletes();
    this.destroyEditAutocompletes();
  },
};
