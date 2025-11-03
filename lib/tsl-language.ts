import type { languages, editor } from 'monaco-editor';

export const tslLanguageConfig: languages.LanguageConfiguration = {
  comments: {
    lineComment: '#',
  },
  brackets: [
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '[', close: ']' },
    { open: '(', close: ')' },
  ],
  surroundingPairs: [
    { open: '[', close: ']' },
    { open: '(', close: ')' },
  ],
};

export const tslMonarchLanguage: languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.tsl',

  keywords: ['if', 'else', 'property', 'error', 'single'],

  operators: ['&&', '||', '!'],

  // Define the symbols
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  tokenizer: {
    root: [
      // Comments
      [/#.*$/, 'comment'],

      // Categories (lines ending with :)
      [/^[^:#.\[\]]+:$/, 'type.identifier'],

      // Choices (lines ending with .)
      [/^[^:#.\[\]]+\.$/, 'string'],

      // Property lists
      [/\[property\b/, { token: 'keyword', next: '@property' }],

      // Markings
      [/\[(error|single)\]/, 'keyword'],

      // Selector expressions
      [/\[if\b/, { token: 'keyword', next: '@selector' }],
      [/\[else\]/, 'keyword'],

      // Operators
      [/&&|\|\||!/, 'operator'],

      // Identifiers (property names in selectors)
      [/[a-zA-Z_][a-zA-Z0-9_]*/, 'variable'],

      // Whitespace
      { include: '@whitespace' },

      // Brackets
      [/[[\]]/, '@brackets'],
      [/[()]/, '@brackets'],
    ],

    property: [
      [/[a-zA-Z_][a-zA-Z0-9_]*/, 'variable.parameter'],
      [/,/, 'delimiter'],
      [/\]/, { token: 'keyword', next: '@pop' }],
      { include: '@whitespace' },
    ],

    selector: [
      [/[a-zA-Z_][a-zA-Z0-9_]*/, 'variable'],
      [/&&|\|\||!/, 'operator'],
      [/[()]/, '@brackets'],
      [/\]/, { token: 'keyword', next: '@pop' }],
      { include: '@whitespace' },
    ],

    whitespace: [[/[ \t\r\n]+/, '']],
  },
};

export const tslTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: 'D4D4D4' }, // Default token color
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'type.identifier', foreground: '4EC9B0', fontStyle: 'bold' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'variable.parameter', foreground: '9CDCFE' },
    { token: 'operator', foreground: 'D4D4D4' },
    { token: 'delimiter', foreground: 'D4D4D4' },
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editor.lineHighlightBackground': '#2A2A2A',
    'editorCursor.foreground': '#AEAFAD',
    'editor.selectionBackground': '#264F78',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#C6C6C6',
  },
};
