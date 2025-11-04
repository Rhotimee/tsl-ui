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

3. The TSLCompiler binary (macOS universal) is included in the `bin/` directory for local development
   - For Docker deployment, the Linux x86_64 binary is automatically downloaded during build

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

## Docker 

**Build the Docker image:**

```bash
docker build -t tsl-ui .
```

**Run the container:**

```bash
docker run -d -p 3000:3000 --name tsl-ui tsl-ui
```

**Access the application:**

Open [http://localhost:3000](http://localhost:3000) in your browser

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

Current TSLCompiler Version: **v1.0.7**

---

Built with Next.js, React, TypeScript, and Tailwind CSS.
