'use client';

import { useState } from 'react';
import TSLEditor from '@/components/TSLEditor';
import OutputPanel from '@/components/OutputPanel';
import ToolBar from '@/components/ToolBar';
import { tslExamples } from '@/lib/examples';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Home() {
  const [tslContent, setTslContent] = useLocalStorage('tsl-content', () => tslExamples[0].content);
  const [output, setOutput] = useState('');
  const [testCount, setTestCount] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string>('');

  const handleCompile = async () => {
    if (!tslContent.trim()) {
      setError('Please enter some TSL content');
      return;
    }

    setIsCompiling(true);
    setError(undefined);
    setOutput('');
    setTestCount(undefined);

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tslContent,
          flags: {
            count: true,
            stdout: true,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Compilation failed');
      } else {
        setOutput(data.testCases || data.stdout || '');
        if (data.testCount !== undefined) {
          setTestCount(data.testCount);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compile');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([tslContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-spec.tsl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setTslContent(content);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setTslContent('');
      setOutput('');
      setError(undefined);
      setTestCount(undefined);
    }
  };

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const exampleName = e.target.value;
    setSelectedExample(exampleName);

    if (exampleName) {
      const example = tslExamples.find((ex) => ex.name === exampleName);
      if (example) {
        setTslContent(example.content);
        setOutput('');
        setError(undefined);
        setTestCount(undefined);
      }
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-700 bg-gray-800 shadow-lg">
        <div className="mx-auto max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">TSL Compiler Web UI</h1>
              <p className="mt-1 text-sm text-gray-400">
                Test Specification Language - Generate test cases from TSL files
              </p>
            </div>

            {/* Example Selector */}
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-400">Examples:</label>
              <select
                value={selectedExample}
                onChange={handleExampleChange}
                className="rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an example...</option>
                {tslExamples.map((example) => (
                  <option key={example.name} value={example.name}>
                    {example.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex-shrink-0">
        <ToolBar
          onCompile={handleCompile}
          onDownload={handleDownload}
          onUpload={handleUpload}
          onClear={handleClear}
          isCompiling={isCompiling}
          hasContent={tslContent.trim().length > 0}
        />
      </div>

      {/* Main Content - Split Pane */}
      <main className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Pane - Editor */}
        <div className="flex w-1/2 flex-col overflow-hidden border-r border-gray-700">
          <div className="flex-shrink-0 border-b border-gray-700 bg-gray-800 px-4 py-2">
            <h3 className="text-sm font-semibold text-gray-200">TSL Input</h3>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <TSLEditor value={tslContent} onChange={setTslContent} height="100%" />
          </div>
        </div>

        {/* Right Pane - Output */}
        <div className="flex w-1/2 flex-col overflow-hidden">
          <OutputPanel
            output={output}
            testCount={testCount}
            error={error}
            isLoading={isCompiling}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-gray-700 bg-gray-800 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>Built with</span>
            <a
              href="https://github.com/divark/TSLCompiler"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              TSLCompiler
            </a>
            <span className="text-gray-600">•</span>
            <span>Compiler Version: v1.0.6</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Built by</span>
            <a
              href="https://rotimi.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Rotimi
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://github.com/yourusername/tsl-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
              title="View source on GitHub"
            >
              Project
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://github.com/divark/TSLCompiler/blob/main/docs/USER_MANUAL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
