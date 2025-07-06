# TODOs for 100% Playwright E2E Coverage and Passing Tests

## Current Blockers
- Next.js dev server is not reliably accessible on port 3000 or 3001 (curl fails, Playwright tests hang or timeout)
- Many zombie/defunct Node.js processes are present, possibly causing port conflicts
- Playwright tests cannot complete due to server not being reachable
- Tailwind CSS error: `bg-background` utility class warning appears, but does not block build
- Linting errors due to missing ESLint plugins, but not blocking build

## Next Steps
- Clean up all zombie/defunct Node.js processes to free up ports
- Ensure only one Next.js dev server is running on the correct port (preferably 3000)
- Confirm server accessibility with curl before running Playwright tests
- Once server is accessible, re-run Playwright tests with shell timeout
- If any Playwright test fails, review trace/screenshots and fix the underlying UI or test issue
- After all tests pass, review for any missing e2e coverage and add tests as needed

## Notes
- All commands must use `timeout 30s ...` to prevent hanging
- Do not proceed to Playwright tests until server is confirmed accessible
- If port 3000 is unavailable, update Playwright config and tests to use the available port