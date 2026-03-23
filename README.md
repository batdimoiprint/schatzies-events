# Schatzies Events Client and Resource Management System

A client and management system for Schatzies to manage communication with their clients and manage event resources.

## Tech Stack

- **Frontend:** React with TypeScript
- **Backend:** Express.js
- **Database:** DynamoDB (NoSQL)

## Hosted on AWS

- AWS Lambda (Express)
- S3 Bucket
- DynamoDB
- API Gateway
- GitHub Actions (CI/CD)
- AWS Lambda (Express)
- S3 Bucket
- DynamoDB
- API Gateway
- GitHub Actions (CI/CD)

## Getting Started

### Prerequisites

- Node.js (v22+)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server with HMR
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint on the codebase
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check if code is formatted correctly
- `pnpm preview` - Preview production build

## Contributing

### Branching

Create branches following this naming convention:

- Feature: `feature/feature-name`
- Bug fix: `bugfix/bug-name`
- Hotfix: `hotfix/issue-name`

```bash
git checkout -b feature/your-feature-name
```

### Code Formatting & Commits

Before committing, ensure your code is properly formatted:

```bash
# Format your code
pnpm format

# Stage your changes
git add .

# Commit with a clear message
git commit -m "type(scope): description"
```

Commit types:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `style:` Formatting/styling changes
- `docs:` Documentation updates
- `chore:` Build and dependency updates

### Submitting Pull Requests

1. Push your branch to the repository
2. Open a Pull Request from your branch to `main`
3. Fill out the PR template with:
	- Clear description of changes
	- Link to related issues
	- Screenshots (if applicable)
4. Request reviewers
5. Address feedback and update your PR
6. Once approved, merge to `main`

Ensure:
- Code passes linting: `pnpm lint`
- Code is properly formatted: `pnpm format:check`
- All tests pass (if applicable)
- No merge conflicts
