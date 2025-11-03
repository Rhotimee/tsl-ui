'use client';

import { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { tslLanguageConfig, tslMonarchLanguage, tslTheme } from '@/lib/tsl-language';

interface TSLEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function TSLEditor({ value, onChange, height = '600px' }: TSLEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const languageRegistered = useRef(false);

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;

    // Register TSL language only once
    if (!languageRegistered.current) {
      // Register the language
      monacoInstance.languages.register({ id: 'tsl' });

      // Set the language configuration
      monacoInstance.languages.setLanguageConfiguration('tsl', tslLanguageConfig);

      // Set the monarch tokenizer
      monacoInstance.languages.setMonarchTokensProvider('tsl', tslMonarchLanguage);

      // Define the theme
      monacoInstance.editor.defineTheme('tsl-dark', tslTheme);

      languageRegistered.current = true;
    }

    // Apply the theme
    monacoInstance.editor.setTheme('tsl-dark');

    // Focus the editor
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className="h-full overflow-hidden rounded-lg border border-gray-700">
      <Editor
        height={height}
        defaultLanguage="tsl"
        language="tsl"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="tsl-dark"
        loading={
          <div className="flex h-full items-center justify-center bg-gray-900">
            <div className="text-gray-400">Loading editor...</div>
          </div>
        }
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
        }}
      />
    </div>
  );
}
