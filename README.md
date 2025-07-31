# SpecTree JavaScript Implementation

A JavaScript implementation of SpecTree - a simple format for composable Markdown trees using `@` references.

## Installation

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test
```

## Usage

```bash
# Resolve @ references in a Markdown file
node src/cli/bin/spectree.js input.md

# Output to a file
node src/cli/bin/spectree.js input.md -o output.md

# Show help
node src/cli/bin/spectree.js --help
```

## Example

Given these files:

```markdown
# main.md
# My App
@stack.md
@design/colors.md

# stack.md
## Tech Stack
- Node.js
- React

# design/colors.md
## Colors
- Primary: #007bff
```

Running `node src/cli/bin/spectree.js main.md` outputs:

```markdown
# My App
## Tech Stack
- Node.js
- React
## Colors
- Primary: #007bff
```

## Project Structure

This is a pnpm monorepo with two packages:

- `src/core` - Core transclusion logic
- `src/cli` - Command-line interface

## Development

```bash
# Run tests for all packages
pnpm test

# Run tests for core package
cd src/core && pnpm test
```