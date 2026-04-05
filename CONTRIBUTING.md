# Contributing to Solarium Protocol

Contributions are welcome. If you are interested in contributing, please follow these guidelines.

## Getting Started

1. Fork the repository.
2. Create a feature branch from `main`.
3. Make your changes following the coding standards below.
4. Ensure all tests pass (`anchor test` for contracts, `pnpm build` for TypeScript).
5. Submit a pull request with a clear description of your changes.

## Coding Standards

- No inline comments in production code. Code must be self-documenting through naming.
- No emojis in code, filenames, or variable names.
- Maximum function length: 30 lines.
- Maximum file length: 200 lines.
- Rust: `snake_case` for functions, `PascalCase` for types. No `unwrap()` in production paths.
- TypeScript: `camelCase` for variables/functions, `PascalCase` for types/classes. No `any`.
- All arithmetic in Rust must use `checked_add` / `checked_sub`.

## Reporting Issues

Open an issue describing the bug or feature request. Include steps to reproduce if applicable.
