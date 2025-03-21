# Project Nest

This is a monorepo containing multiple related projects and packages.

## Structure

```
project-nest/
├── packages/           # Contains all the packages/projects
├── package.json       # Root package.json with workspace configuration
└── README.md         # This file
```

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Build all packages:
   ```bash
   yarn build
   ```

3. Run tests:
   ```bash
   yarn test
   ```

## Available Scripts

- `yarn build` - Build all packages
- `yarn test` - Run tests across all packages
- `yarn lint` - Run linting across all packages

## Adding New Packages

To add a new package:

1. Create a new directory in the `packages/` folder
2. Initialize it with a `package.json`
3. Add your package code
4. The package will automatically be included in the workspace

## Development

Each package in the `packages/` directory can be developed independently while sharing common dependencies and configurations defined in the root `package.json`. 