# @spectree/cli

## 1.0.0

### Major Changes

- f5116b3: # 🎉 Initial Release of SpecTree

  SpecTree is a simple format for composable Markdown trees using `@` references. This JavaScript implementation provides both a core library and CLI tool for processing Markdown files with transclusion support.

  ## What is SpecTree?

  SpecTree allows you to compose Markdown documents by referencing other Markdown files using the `@` syntax. When you process a file with SpecTree, all references are resolved and inlined, creating a single unified document.

  ## Key Features
  - **Simple syntax**: Just use `@filename.md` to include another file
  - **Recursive resolution**: Referenced files can include their own references
  - **Safety features**: Prevents circular references and path traversal attacks
  - **Flexible usage**: Available as both a library (`@spectree/core`) and CLI tool (`@spectree/cli`)
  - **Modern JavaScript**: Built with ES modules and requires Node.js 18+

  ## Example Usage

  ```sh
  # Install the CLI globally
  npm install -g @spectree/cli

  # Process a Markdown file
  spectree input.md -o output.md
  ```

  Or use the core library in your code:

  ```js
  import { resolveFile } from "@spectree/core";

  const resolved = await resolveFile("input.md");
  console.log(resolved);
  ```

  ## Packages
  - **`@spectree/core`**: Core functionality for parsing and resolving SpecTree references
  - **`@spectree/cli`**: Command-line interface for processing SpecTree files

  This initial release provides a solid foundation for Markdown composition workflows. Future releases will add more features based on community feedback.

### Patch Changes

- Updated dependencies [f5116b3]
  - @spectree/core@1.0.0
