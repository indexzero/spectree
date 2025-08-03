# SpecTree JavaScript Implementation

A JavaScript implementation of SpecTree - a simple format for composable Markdown trees using `@` references.

## Installation

```sh
# Install globally
npm install -g @spectree/cli

# Or with pnpm
pnpm add -g @spectree/cli

# Or run directly with npx
npx @spectree/cli <file>
```

## Usage

```sh
# Resolve @ references in a Markdown file
spectree input.md

# Output to a file
spectree input.md -o output.md

# Show help
spectree --help
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

Running `spectree main.md` outputs:

```markdown
# My App
## Tech Stack
- Node.js
- React
## Colors
- Primary: #007bff
```

# Inspiration

This was heavily inspired by [fuzzycomputer/spectree](https://github.com/fuzzycomputer/spectree) and his [writing about it](https://www.fuzzycomputer.com/posts/spectree).
The original `README.md` and `README.spec.md` are included in `dev/ref` for reference purposes *(with attribution)*.

## Contributing

Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to this project.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.
