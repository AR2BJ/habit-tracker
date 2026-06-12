// =============================
// HABIT EVENTS START
// =============================

import { toggleHabit, toggleHabitDate } from "./habit.service.js";

import { createHabit } from "./habit.service.js";
import { deleteHabit } from "./habit.service.js";
import { editHabit } from "./habit.service.js";
import { renderDashboard } from "../dashboard/dashboard.ui.js";
import { renderHabits } from "./habit.ui.js";
import { saveToStorage } from "../storage.js";
import { state } from "../state.js";

// =============================
// EDIT MODAL STATE START
// =============================

let pendingEditId = null;

// =============================
// EDIT MODAL STATE END
// =============================

// =============================
// DELETE MODAL STATE START
// =============================

let pendingDeleteId = null;

// =============================
// UNDO DELETE STATE START
// =============================

let lastDeletedHabit = null;
let undoTimer = null;

// =============================
// UNDO DELETE STATE END
// =============================

// =============================
// DELETE MODAL STATE END
// =============================

export function bindHabitEvents() {
  const input = document.getElementById("habit-input");
  const button = document.getElementById("add-habit-btn");

  button.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) return;

    createHabit(value);
    renderHabits(state.habits);
    renderDashboard(state.habits);
    input.value = "";
  });

  // =============================
  // ADD HABIT ENTER KEY START
  // =============================

  document.getElementById("habit-input")?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    document.getElementById("add-habit-btn")?.click();
  });

  // =============================
  // ADD HABIT ENTER KEY END
  // =============================

  // =============================
  // EDIT & DELETE MODAL ENTER/ESCAPE START
  // =============================

  document.addEventListener("keydown", (e) => {
    const deleteModal = document.getElementById("delete-modal");

    const editModal = document.getElementById("edit-modal");

    const deleteOpen = !deleteModal.classList.contains("hidden");

    const editOpen = !editModal.classList.contains("hidden");

    if (!deleteOpen && !editOpen) return;

    if (e.key === "Escape") {
      if (deleteOpen) closeDeleteModal();
      if (editOpen) closeEditModal();
    }

    if (e.key === "Enter") {
      if (deleteOpen) {
        document.getElementById("confirm-delete")?.click();
      }

      if (editOpen) {
        document.getElementById("confirm-edit")?.click();
      }
    }
  });

  // =============================
  // EDIT & DELETE MODAL ENTER/ESCAPE END
  // =============================

  // =============================
  // TOGGLE EVENT BINDING START
  // =============================

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggle-btn")) {
      const id = e.target.dataset.id;

      toggleHabit(id);
      renderHabits(state.habits);
      renderDashboard(state.habits);
    }

    // =============================
    // CALENDAR BACKFILL START
    // =============================

    if (e.target.classList.contains("calendar-day")) {
      const date = e.target.dataset.date;

      const habitId = e.target.dataset.habitId;

      const today = new Date().toISOString().split("T")[0];

      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      if (date !== today && date !== yesterday) {
        return;
      }

      toggleHabitDate(habitId, date);

      renderHabits(state.habits);
      renderDashboard(state.habits);

      return;
    }

    // =============================
    // CALENDAR BACKFILL END
    // =============================

    // =============================
    // EDIT EVENT HANDLER START
    // =============================

    if (e.target.closest(".edit-btn")) {
      const button = e.target.closest(".edit-btn");

      openEditModal(button.dataset.id, button.dataset.name);

      return;
    }

    // =============================
    // EDIT EVENT HANDLER END
    // =============================

    // =============================
    // EDIT MODAL EVENTS START
    // =============================

    document.getElementById("confirm-edit")?.addEventListener("click", () => {
      if (!pendingEditId) return;

      const input = document.getElementById("edit-habit-input");

      editHabit(pendingEditId, input.value);

      renderHabits(state.habits);
      renderDashboard(state.habits);

      closeEditModal();
    });

    document.getElementById("cancel-edit")?.addEventListener("click", () => {
      closeEditModal();
    });

    // =============================
    // EDIT MODAL EVENTS END
    // =============================

    // =============================
    // DELETE EVENT HANDLER START
    // =============================

    if (e.target.closest(".delete-btn")) {
      const button = e.target.closest(".delete-btn");

      openDeleteModal(button.dataset.id);

      return;
    }

    // =============================
    // DELETE EVENT HANDLER END
    // =============================

    // =============================
    // DELETE MODAL EVENTS START
    // =============================

    document.getElementById("confirm-delete")?.addEventListener("click", () => {
      if (!pendingDeleteId) return;

      lastDeletedHabit = state.habits.find((h) => h.id === pendingDeleteId);

      deleteHabit(pendingDeleteId);

      renderHabits(state.habits);
      renderDashboard(state.habits);

      closeDeleteModal();

      showUndoToast();
    });

    document.getElementById("cancel-delete")?.addEventListener("click", () => {
      closeDeleteModal();
    });

    // =============================
    // DELETE MODAL EVENTS END
    // =============================
  });

  // =============================
  // UNDO DELETE EVENT START
  // =============================

  document.getElementById("undo-delete-btn")?.addEventListener("click", () => {
    if (!lastDeletedHabit) return;

    state.habits.push(lastDeletedHabit);

    renderHabits(state.habits);
    renderDashboard(state.habits);

    saveToStorage(state);

    lastDeletedHabit = null;

    hideUndoToast();
  });

  // =============================
  // UNDO DELETE EVENT END
  // =============================

  // =============================
  // TOGGLE EVENT BINDING END
  // =============================
}

// =============================
// EDIT MODAL HELPERS START
// =============================

function openEditModal(id, currentName) {
  pendingEditId = id;

  document.getElementById("edit-habit-input").value = currentName;

  document.getElementById("edit-modal").classList.remove("hidden");
}

function closeEditModal() {
  pendingEditId = null;

  document.getElementById("edit-modal").classList.add("hidden");
}

// =============================
// EDIT MODAL HELPERS END
// =============================

// =============================
// DELETE MODAL HELPERS START
// =============================

function openDeleteModal(id) {
  pendingDeleteId = id;

  document.getElementById("delete-modal").classList.remove("hidden");
}

function closeDeleteModal() {
  pendingDeleteId = null;

  document.getElementById("delete-modal").classList.add("hidden");
}

// =============================
// DELETE MODAL HELPERS END
// =============================

// =============================
// UNDO TOAST HELPERS START
// =============================

function showUndoToast() {
  const toast = document.getElementById("undo-toast");

  toast.classList.remove("hidden");

  clearTimeout(undoTimer);

  let seconds = 5;

  const countdown = document.getElementById("undo-countdown");

  countdown.textContent = `${seconds}s`;

  const interval = setInterval(() => {
    seconds--;

    countdown.textContent = `${seconds}s`;

    if (seconds <= 1) {
      clearInterval(interval);
    }
  }, 1000);

  undoTimer = setTimeout(() => {
    clearInterval(interval);

    toast.classList.add("hidden");

    lastDeletedHabit = null;
  }, 5000);
}

function hideUndoToast() {
  document.getElementById("undo-toast").classList.add("hidden");

  clearTimeout(undoTimer);
}

// =============================
// UNDO TOAST HELPERS END
// =============================

// =============================
// HABIT EVENTS END
// =============================
