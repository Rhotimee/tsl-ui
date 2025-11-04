import { vi } from 'vitest';

interface EditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  theme?: string;
  options?: Record<string, unknown>;
  height?: string;
}

// Mock Monaco Editor component
const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <textarea
      data-testid="monaco-editor"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="Enter TSL content here..."
    />
  );
};

export default Editor;
export { Editor };
