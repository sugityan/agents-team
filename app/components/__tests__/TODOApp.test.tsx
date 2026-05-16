import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TODOApp from "../TODOApp";

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

beforeEach(() => {
  vi.stubGlobal("localStorage", mockLocalStorage);
  vi.stubGlobal("crypto", {
    randomUUID: vi.fn(() => "test-uuid-" + Math.random()),
  });
  mockLocalStorage.getItem.mockReturnValue(null);
  mockLocalStorage.setItem.mockClear();
});

describe("TODOApp", () => {
  it("renders the component with initial UI elements", () => {
    render(<TODOApp />);

    expect(screen.getByText("My Tasks")).toBeDefined();
    expect(screen.getByPlaceholderText("Add a new task...")).toBeDefined();
    expect(screen.getByText("Add")).toBeDefined();
    expect(screen.getByText("All")).toBeDefined();
    expect(screen.getByText("Active")).toBeDefined();
    expect(screen.getByText("Completed")).toBeDefined();
    expect(screen.getByText("No tasks found")).toBeDefined();
  });

  describe("Adding tasks", () => {
    it("adds a new task when Add button is clicked", async () => {
      render(<TODOApp />);

      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByText("Add");

      fireEvent.change(input, { target: { value: "Buy groceries" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeDefined();
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it("adds a new task when Enter key is pressed", async () => {
      render(<TODOApp />);

      const input = screen.getByPlaceholderText("Add a new task...");

      fireEvent.change(input, { target: { value: "Walk the dog" } });
      fireEvent.keyDown(input, { key: "Enter" });

      await waitFor(() => {
        expect(screen.getByText("Walk the dog")).toBeDefined();
      });
    });

    it("does not add empty task when input is empty", () => {
      render(<TODOApp />);

      const addButton = screen.getByText("Add");
      fireEvent.click(addButton);

      expect(screen.getByText("No tasks found")).toBeDefined();
    });

    it("does not add task with only whitespace", () => {
      render(<TODOApp />);

      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByText("Add");

      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.click(addButton);

      expect(screen.getByText("No tasks found")).toBeDefined();
    });

    it("clears input after adding task", async () => {
      render(<TODOApp />);

      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByText("Add");

      fireEvent.change(input, { target: { value: "Test task" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect((input as HTMLInputElement).value).toBe("");
      });
    });
  });

  describe("Deleting tasks", () => {
    it("deletes a task when Delete button is clicked", async () => {
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify([
          { id: "1", text: "Task to delete", completed: false },
        ])
      );

      render(<TODOApp />);

      await waitFor(() => {
        expect(screen.getByText("Task to delete")).toBeDefined();
      });

      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Task to delete")).toBeNull();
      });
    });
  });

  describe("Toggling tasks", () => {
    it("toggles task completion when checkbox is clicked", async () => {
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify([{ id: "1", text: "Toggle test", completed: false }])
      );

      render(<TODOApp />);

      await waitFor(() => {
        expect(screen.getByText("Toggle test")).toBeDefined();
      });

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      await waitFor(() => {
        const taskText = screen.getByText("Toggle test");
        expect(taskText.className).toContain("line-through");
      });
    });

    it("shows remaining task count correctly", async () => {
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify([
          { id: "1", text: "Task 1", completed: false },
          { id: "2", text: "Task 2", completed: false },
          { id: "3", text: "Task 3", completed: true },
        ])
      );

      render(<TODOApp />);

      await waitFor(() => {
        expect(screen.getByText("2 remaining task(s)")).toBeDefined();
      });
    });
  });

  describe("Filtering tasks", () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify([
          { id: "1", text: "Active task 1", completed: false },
          { id: "2", text: "Active task 2", completed: false },
          { id: "3", text: "Completed task", completed: true },
        ])
      );
    });

    it("shows all tasks when All filter is selected", async () => {
      render(<TODOApp />);

      await waitFor(() => {
        expect(screen.getByText("Active task 1")).toBeDefined();
        expect(screen.getByText("Active task 2")).toBeDefined();
        expect(screen.getByText("Completed task")).toBeDefined();
      });
    });

    it("shows only active tasks when Active filter is selected", async () => {
      render(<TODOApp />);

      const activeButton = screen.getByText("Active");
      fireEvent.click(activeButton);

      await waitFor(() => {
        expect(screen.getByText("Active task 1")).toBeDefined();
        expect(screen.getByText("Active task 2")).toBeDefined();
        expect(screen.queryByText("Completed task")).toBeNull();
      });
    });

    it("shows only completed tasks when Completed filter is selected", async () => {
      render(<TODOApp />);

      const completedButton = screen.getByText("Completed");
      fireEvent.click(completedButton);

      await waitFor(() => {
        expect(screen.queryByText("Active task 1")).toBeNull();
        expect(screen.queryByText("Active task 2")).toBeNull();
        expect(screen.getByText("Completed task")).toBeDefined();
      });
    });
  });

  describe("Edge cases", () => {
    it("handles very long task text", async () => {
      const longText = "A".repeat(1000);
      render(<TODOApp />);

      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByText("Add");

      fireEvent.change(input, { target: { value: longText } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(longText)).toBeDefined();
      });
    });

    it("handles special characters in task text", async () => {
      const specialText = "<script>alert('xss')</script>";
      render(<TODOApp />);

      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByText("Add");

      fireEvent.change(input, { target: { value: specialText } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(specialText)).toBeDefined();
      });
    });
  });
});