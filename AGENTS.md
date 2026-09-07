This project is the Expo React Native app for the Mealie recipe manager and meal planner.

Package manager: pnpm.

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Default Workflow

1. Identify the touched surface(s).
2. Load relevant skills/docs matching those surfaces (see "Agent Skills") and apply their conventions before implementing.
3. Run the matching "Validation Commands".

## Agent Skills

Skills are source-of-truth instructions; each skill's description states when it applies. When skill discovery is unavailable, read a skill directly at `.agents/skills/<skill>/SKILL.md`.

If instructions conflict with no clear path forward or guidance is ambiguous, ask the user before proceeding.

### Issue tracker

GitHub Issues in SenseiMarv/mealiego. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical five: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.

## Validation Commands

Prefix every run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use
```

Run the smallest set matching the change:

- `pnpm lint`
- `pnpm test`

## Constraints

- Never commit secrets or confidential information.
- Keep existing comments, including rule-configuration comments, unless explicitly asked to remove them.
