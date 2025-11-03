'use client';

interface OutputPanelProps {
  output: string;
  testCount?: number;
  error?: string;
  isLoading?: boolean;
}

export default function OutputPanel({
  output,
  testCount,
  error,
  isLoading = false,
}: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-200">Output</h3>
        {testCount !== undefined && (
          <span className="text-xs text-gray-400">
            {testCount} test case{testCount !== 1 ? 's' : ''} generated
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-gray-900 p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-gray-400">
              <svg
                className="mx-auto mb-2 h-8 w-8 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-center">Compiling...</p>
            </div>
          </div>
        ) : error ? (
          <div className="whitespace-pre-wrap font-mono text-sm text-red-400">
            <div className="rounded border border-red-800 bg-red-900/20 p-3">
              <div className="mb-2 font-bold">Error:</div>
              {error}
            </div>
          </div>
        ) : output ? (
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-200">{output}</pre>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4 h-16 w-16 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>No output yet</p>
              <p className="mt-2 text-xs">Click &quot;Compile&quot; to generate test cases</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
