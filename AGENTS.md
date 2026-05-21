# AGENTS.md

## Project overview
Morning task organizer MVP. Keep it local-first and user-confirmation-driven.

## Development rules
- Keep the MVP simple and local-first.
- Do not add external SaaS dependencies unless explicitly requested.
- Do not auto-create real calendar events in MVP.
- Always keep user confirmation before scheduling.
- Use TypeScript types for all task and schedule objects.
- Write or update tests when parser/classifier logic changes.
- Prefer pure functions in src/lib.
- Use Asia/Tokyo as the default timezone.
- Handle ambiguous Japanese dates by marking tasks as pending/保留.

## Architecture rules
- Parser/classifier/scheduler must be separated modules.
- API route should keep fallback to rule-based parser.

## Testing commands
- npm run test
- npm run lint
- npm run build

## Coding style
- TypeScript strict mode.
- Keep UI simple and readable.

## AI parser safety rules
- Never perform auto calendar registration.
- If ambiguous, mark pending and explain reason.

## Do not do
- Do not guess ambiguous due dates aggressively.
- Do not require API key for MVP.
