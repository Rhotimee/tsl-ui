export interface TSLExample {
  name: string;
  description: string;
  content: string;
}

export const tslExamples: TSLExample[] = [
  {
    name: 'Basic Test',
    description: 'Simple test specification with categories and choices',
    content: `# Basic Test Example
# This demonstrates categories and choices

Browser:
Chrome.
Firefox.
Safari.

Operating System:
Windows.
macOS.
Linux.`,
  },
  {
    name: 'Properties',
    description: 'Using properties to group related choices',
    content: `# Properties Example
# Demonstrates property lists and selectors

Payment Method:
Credit Card. [property card]
PayPal.
Bitcoin.

Shipping:
Standard. [if !card]
Express. [if card]
Overnight. [if card]`,
  },
  {
    name: 'Selector Expressions',
    description: 'Complex selector expressions with logical operators',
    content: `# Selector Expressions Example
# Shows AND, OR, and NOT operators

User Type:
Admin. [property admin]
Premium User. [property premium]
Free User.

Features:
Dashboard Access. [if admin || premium]
Advanced Analytics. [if admin]
Basic Reports.
Export Data. [if admin || premium]
Email Support. [if !admin]`,
  },
  {
    name: 'Error Marking',
    description: 'Using [error] to mark invalid combinations',
    content: `# Error Marking Example
# Demonstrates error cases

Browser:
Internet Explorer 6. [property old_browser]
Chrome.
Firefox.

Security:
HTTPS.
HTTP. [if old_browser] [error]`,
  },
  {
    name: 'Single Marking',
    description: 'Using [single] to generate exactly one test',
    content: `# Single Marking Example
# Generate one specific test case

Database:
PostgreSQL. [property modern]
MySQL.
MongoDB.
Legacy System. [single]

Features:
Transactions. [if modern]
ACID Compliance. [if modern]
Basic CRUD.`,
  },
  {
    name: 'Nested Categories',
    description: 'Multiple categories with dependencies',
    content: `# Nested Categories Example
# Complex test scenario

Device:
Desktop. [property large_screen]
Tablet. [property medium_screen]
Mobile. [property small_screen]

Resolution:
4K. [if large_screen]
1080p. [if large_screen || medium_screen]
720p.

Orientation:
Portrait. [if small_screen || medium_screen]
Landscape.`,
  },
];

export function getExampleByName(name: string): TSLExample | undefined {
  return tslExamples.find((example) => example.name === name);
}

export function getExampleNames(): string[] {
  return tslExamples.map((example) => example.name);
}
