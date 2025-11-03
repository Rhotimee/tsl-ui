'use client';

interface ToolBarProps {
  onCompile: () => void;
  onDownload: () => void;
  onUpload: (file: File) => void;
  onClear: () => void;
  isCompiling: boolean;
  hasContent: boolean;
}

export default function ToolBar({
  onCompile,
  onDownload,
  onUpload,
  onClear,
  isCompiling,
  hasContent,
}: ToolBarProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // Reset the input so the same file can be uploaded again
    e.target.value = '';
  };

  return (
    <div className="border-b border-gray-700 bg-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Compile Button */}
          <button
            onClick={onCompile}
            disabled={isCompiling || !hasContent}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {isCompiling ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
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
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Compile</span>
              </>
            )}
          </button>
        </div>

        {/* File Actions */}
        <div className="flex items-center space-x-2">
          {/* Upload Button */}
          <label className="flex cursor-pointer items-center space-x-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Upload</span>
            <input type="file" accept=".tsl" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Download Button */}
          <button
            onClick={onDownload}
            disabled={!hasContent}
            className="flex items-center space-x-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download</span>
          </button>

          {/* Clear Button */}
          <button
            onClick={onClear}
            disabled={!hasContent}
            className="flex items-center space-x-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}
