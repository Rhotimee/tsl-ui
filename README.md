# TSL Compiler Web UI

A web application for the [TSL (Test Specification Language) Compiler](https://github.com/divark/TSLCompiler). This web interface provides an intuitive way to write TSL specifications and generate test cases without using the command line.

## Features

### Core Functionality

- **Monaco Editor Integration**: Code editor with syntax highlighting for TSL
- **Real-time Compilation**: Compile TSL files directly in the browser
- **Split-pane Layout**: Side-by-side view of input TSL and generated test cases
- **Error Display**: Error messages when compilation fails

### TSL Language Support

- Syntax highlighting for:
  - Categories (ending with `:`)
  - Choices (ending with `.`)
  - Comments (lines starting with `#`)
  - Property lists (`[property name1, name2]`)
  - Selector expressions (`[if expression]`, `[else]`)
  - Markings (`[error]`, `[single]`)
  - Logical operators (`&&`, `||`, `!`)

### File Management

- **Upload**: Load existing TSL files from your computer
- **Download**: Save your TSL specifications as `.tsl` files
- **Auto-save**: Automatic persistence using browser localStorage
- **Clear**: Reset the editor with confirmation

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. The TSLCompiler binary for macOS is already included in the `bin/` directory

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
tsl-ui/
├── app/
│   ├── api/
│   │   └── compile/
│   │       └── route.ts          # API endpoint for TSLCompiler execution
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── components/
│   ├── TSLEditor.tsx             # Monaco editor component with TSL support
│   ├── OutputPanel.tsx           # Test case output display
│   └── ToolBar.tsx               # Compilation controls and file operations
├── lib/
│   ├── tsl-language.ts           # TSL language definition for Monaco
│   └── examples.ts               # Example TSL files library
├── bin/
│   └── tslcompiler               # TSLCompiler binary (macOS)
└── public/                       # Static assets
```

## How It Works

1. **Frontend**: Built with Next.js 15, React 18, and Tailwind CSS
2. **Editor**: Monaco Editor (VS Code's editor) with custom TSL language support
3. **Compilation**: Next.js API route executes TSLCompiler as a child process
4. **Flow**:
   - User writes TSL in the editor
   - Clicks "Compile" button
   - Frontend sends TSL content to `/api/compile`
   - Backend writes content to temporary file
   - TSLCompiler processes the file
   - Results are returned and displayed

## Contributing

This project was built to fill the gap of having no GUI for TSL compilers. Contributions are welcome!

## Credits

- Built with [TSLCompiler](https://github.com/divark/TSLCompiler) by divark
- Inspired by [tslgenerator](https://github.com/alexorso/tslgenerator) by alexorso
- Powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## License

This project is open source. Please refer to the TSLCompiler project for compiler licensing information.

## Support

- [TSLCompiler Documentation](https://github.com/divark/TSLCompiler/blob/main/docs/USER_MANUAL.md)
- [TSLCompiler Issues](https://github.com/divark/TSLCompiler/issues)

## Version

Current TSLCompiler Version: **v1.0.6**

---

Built with Next.js, React, TypeScript, and Tailwind CSS.
