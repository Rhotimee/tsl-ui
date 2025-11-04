import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';

// Mock the Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
    <textarea
      data-testid="monaco-editor"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter TSL content here..."
    />
  ),
}));

describe('Home Page Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial State & Persistence', () => {
    it('should load with default example content on first visit', () => {
      render(<Home />);

      const editor = screen.getByTestId('monaco-editor') as HTMLTextAreaElement;
      // The default content should contain "Browser" from the Basic Test example
      expect(editor.value).toContain('Browser');
      expect(editor.value).toContain('Chrome');
    });

    it('should restore content from localStorage on subsequent visits', () => {
      const savedContent = 'My saved TSL content';
      localStorage.setItem('tsl-content', JSON.stringify(savedContent));

      render(<Home />);

      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveValue(savedContent);
    });

    it('should display initial empty output state', () => {
      render(<Home />);

      expect(screen.getByText(/Click "Compile" to generate test cases/i)).toBeInTheDocument();
    });

    it('should persist editor content to localStorage on change', async () => {
      render(<Home />);

      const editor = screen.getByTestId('monaco-editor');
      await user.clear(editor);
      await user.type(editor, 'New content');

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('tsl-content') || '""');
        expect(stored).toBe('New content');
      });
    });
  });

  describe('Compile Flow', () => {
    it('should successfully compile TSL content and display test cases', async () => {
      const mockResponse = {
        testCases: 'Test Case 1\nTest Case 2\nTest Case 3',
        testCount: 3,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      render(<Home />);

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      // Wait for compilation to complete
      await waitFor(() => {
        expect(screen.getByText(/Test Case 1/)).toBeInTheDocument();
      });

      // Should display all test cases
      expect(screen.getByText(/Test Case 2/)).toBeInTheDocument();
      expect(screen.getByText(/Test Case 3/)).toBeInTheDocument();

      // Should display test count
      expect(screen.getByText(/3 test cases generated/i)).toBeInTheDocument();
    });

    it('should display loading state during compilation', async () => {
      let resolvePromise: (value: unknown) => void;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      global.fetch = vi.fn().mockReturnValue(fetchPromise);

      render(<Home />);

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      // Should show loading indicator (there will be 2 instances: in button and output panel)
      expect(screen.getAllByText(/compiling/i).length).toBeGreaterThan(0);

      // Compile button should be disabled
      expect(compileButton).toBeDisabled();

      // Resolve the fetch
      resolvePromise!({
        ok: true,
        json: async () => ({ testCases: 'Test 1', testCount: 1 }),
      });

      await waitFor(() => {
        expect(screen.getByText(/Test 1/)).toBeInTheDocument();
      });
    });

    it('should handle compilation errors gracefully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Syntax error on line 5' }),
      });

      render(<Home />);

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      await waitFor(() => {
        expect(screen.getByText(/Syntax error on line 5/i)).toBeInTheDocument();
      });
    });

    it('should prevent compilation when editor is empty', async () => {
      render(<Home />);

      const editor = screen.getByTestId('monaco-editor');
      await user.clear(editor);

      global.fetch = vi.fn();

      const compileButton = screen.getByRole('button', { name: /compile/i });

      // Wait for button to be enabled (after clearing sets hasContent to false)
      await waitFor(() => {
        expect(compileButton).toBeDisabled();
      });

      // Try to click (it will be disabled, but test the logic)
      // Since button is disabled, we need to trigger handleCompile manually or check button state
      // Actually, let's just verify the button is disabled when content is empty
      expect(compileButton).toBeDisabled();

      // Should not call API
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle network errors during compilation', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(<Home />);

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });

    it('should clear previous output when starting new compilation', async () => {
      // First compilation
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ testCases: 'Old Test Case', testCount: 1 }),
      });

      render(<Home />);

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      await waitFor(() => {
        expect(screen.getByText(/Old Test Case/)).toBeInTheDocument();
      });

      // Second compilation
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ testCases: 'New Test Case', testCount: 1 }),
      });

      await user.click(compileButton);

      await waitFor(() => {
        expect(screen.queryByText(/Old Test Case/)).not.toBeInTheDocument();
        expect(screen.getByText(/New Test Case/)).toBeInTheDocument();
      });
    });
  });

  describe('File Upload Flow', () => {
    it('should load uploaded .tsl file content into editor', async () => {
      render(<Home />);

      const fileContent = 'Uploaded TSL content\nLine 2\nLine 3';
      const file = new File([fileContent], 'test.tsl', { type: 'text/plain' });

      const uploadInput = screen.getByLabelText(/upload/i);
      await user.upload(uploadInput, file);

      await waitFor(() => {
        const editor = screen.getByTestId('monaco-editor');
        expect(editor).toHaveValue(fileContent);
      });
    });

    it('should allow compiling uploaded content', async () => {
      const mockResponse = {
        testCases: 'Generated test from upload',
        testCount: 1,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      render(<Home />);

      const fileContent = 'Category:\n  Option1.\n  Option2.';
      const file = new File([fileContent], 'test.tsl', { type: 'text/plain' });

      const uploadInput = screen.getByLabelText(/upload/i);
      await user.upload(uploadInput, file);

      await waitFor(() => {
        const editor = screen.getByTestId('monaco-editor');
        expect(editor).toHaveValue(fileContent);
      });

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      await waitFor(() => {
        expect(screen.getByText(/Generated test from upload/)).toBeInTheDocument();
      });
    });
  });

  describe('File Download Flow', () => {
    it('should download editor content as .tsl file', async () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      render(<Home />);

      const editor = screen.getByTestId('monaco-editor');
      await user.clear(editor);
      await user.type(editor, 'Download this content');

      const downloadButton = screen.getByRole('button', { name: /download/i });
      await user.click(downloadButton);

      // Verify anchor element was created and clicked
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      // Verify blob creation
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should disable download button when editor is empty', async () => {
      render(<Home />);

      const editor = screen.getByTestId('monaco-editor');
      await user.clear(editor);

      const downloadButton = screen.getByRole('button', { name: /download/i });
      expect(downloadButton).toBeDisabled();
    });
  });

  describe('Example Selection Flow', () => {
    it('should load selected example into editor', async () => {
      render(<Home />);

      const exampleSelect = screen.getByRole('combobox');
      await user.selectOptions(exampleSelect, 'Properties');

      await waitFor(() => {
        const editor = screen.getByTestId('monaco-editor');
        expect(editor.value).toContain('Properties');
      });
    });

    it('should clear output when loading example', async () => {
      // First compile to get output
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ testCases: 'Previous output', testCount: 1 }),
      });

      render(<Home />);

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      await waitFor(() => {
        expect(screen.getByText(/Previous output/)).toBeInTheDocument();
      });

      // Load example
      const exampleSelect = screen.getByRole('combobox');
      await user.selectOptions(exampleSelect, 'Basic Test');

      await waitFor(() => {
        expect(screen.queryByText(/Previous output/)).not.toBeInTheDocument();
        expect(screen.getByText(/Click "Compile" to generate test cases/i)).toBeInTheDocument();
      });
    });

    it('should allow compiling example content', async () => {
      const mockResponse = {
        testCases: 'Example compilation result',
        testCount: 2,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      render(<Home />);

      const exampleSelect = screen.getByRole('combobox');
      await user.selectOptions(exampleSelect, 'Selector Expressions');

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      await waitFor(() => {
        expect(screen.getByText(/Example compilation result/)).toBeInTheDocument();
      });

      expect(screen.getByText(/2 test cases generated/i)).toBeInTheDocument();
    });
  });

  describe('Clear Functionality', () => {
    it('should clear editor content when confirmed', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<Home />);

      const editor = screen.getByTestId('monaco-editor');
      expect(editor.value).not.toBe('');

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to clear the editor?');

      await waitFor(() => {
        expect(editor).toHaveValue('');
      });
    });

    it('should not clear editor when cancelled', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<Home />);

      const editor = screen.getByTestId('monaco-editor');
      const originalValue = editor.value;

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(confirmSpy).toHaveBeenCalled();
      expect(editor).toHaveValue(originalValue);
    });

    it('should clear output and errors when clearing editor', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      // First create some output
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ testCases: 'Some output', testCount: 1 }),
      });

      render(<Home />);

      const compileButton = screen.getByRole('button', { name: /compile/i });
      await user.click(compileButton);

      await waitFor(() => {
        expect(screen.getByText(/Some output/)).toBeInTheDocument();
      });

      // Clear everything
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText(/Some output/)).not.toBeInTheDocument();
        expect(screen.getByText(/Click "Compile" to generate test cases/i)).toBeInTheDocument();
      });
    });

    it('should clear localStorage when clearing editor', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<Home />);

      const editor = screen.getByTestId('monaco-editor') as HTMLTextAreaElement;

      // Type some content first to ensure localStorage is set
      await user.clear(editor);
      await user.type(editor, 'Some test content');

      // Wait for localStorage to be populated with the content
      await waitFor(() => {
        const stored = localStorage.getItem('tsl-content');
        expect(stored).toBeTruthy();
      });

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('tsl-content') || '""');
        expect(stored).toBe('');
      });
    });

    it('should disable clear button when editor is empty', async () => {
      render(<Home />);

      const editor = screen.getByTestId('monaco-editor');
      await user.clear(editor);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeDisabled();
    });
  });
});
