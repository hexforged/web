# 🤖 AGENTS.md

Operational contract for humans and AI agents working in this repository.
Read this file fully before making any change. Domain context lives in
[CONTEXT.md](CONTEXT.md).

## Repository

- **Project:** `hexforged/web` — official website for the game **Hexforged**.
- **Game source:** lives in the separate repository `hexforged/game`. Do not put
  game code here.
- **Framework:** [`kyaulabs/aurora`](https://github.com/kyaulabs/aurora), pinned
  as the git submodule `aurora/`. Never edit files inside the submodule; open
  changes upstream instead.
- **Stack:** PHP 8.5+, Pest 4 (TDD), vanilla CSS, Three.js (vendored from npm).

## Identities and access

This machine (`kyau@aura`) holds GPG/SSH keys for the **`kyau`** GitHub account
via a YubiKey. The `gh` CLI has both `kyau` and `kyaulabs-bot` authenticated.

| Action | Identity | How |
| --- | --- | --- |
| Commit (author + committer) | `kyau <kyau@kyau.net>` | default git config; commits are GPG-signed with the YubiKey |
| Push branches / tags | `kyau` | SSH remote (`git@github.com:hexforged/web`) |
| Open pull requests | `kyaulabs-bot` | `GH_TOKEN=$(gh auth token -u kyaulabs-bot) gh pr create …` |
| Approve pull requests | `kyau` | `GH_TOKEN=$(gh auth token -u kyau) gh pr review --approve …` |
| Merge pull requests | `kyaulabs-bot` | `GH_TOKEN=$(gh auth token -u kyaulabs-bot) gh pr merge …` |

Prefer per-command `GH_TOKEN` over `gh auth switch` so the global CLI state is
never mutated. Repository rulesets require **at least one approving review**
before merge; the flow below satisfies it.

## Git Flow (mandatory)

- `main` — production; default branch; tagged releases only.
- `develop` — integration branch; all work merges here first.
- Feature/fix branches are cut **from `develop`** and MUST be named:

  ```
  <type>/kyau-$(openssl rand -hex 3)-<short-description>
  ```

  Example: `feat/kyau-0400b2-initial-website`. The `<type>` prefix is a
  Conventional Commits type (`feat`, `fix`, `docs`, `refactor`, `perf`,
  `test`, `ci`, `chore`). Release branches follow git flow
  (`release/vX.Y.Z` from `develop`, merged to `main` and back to `develop`);
  hotfixes use `hotfix/kyau-<hex>-<desc>` from `main`.

- After every merge to `main`, the **back-merge workflow**
  (`.github/workflows/back-merge.yml`) opens a PR from `main` into `develop`.
  Keep it green; resolve conflicts promptly.

## Commits

- **Conventional Commits**, enforced by commitlint (types: `feat`, `patch`,
  `fix`, `docs`, `perf`, `refactor`, `revert`, `style`, `test`, `ci`,
  `chore`, `ignore`).
- **Atomic**: one concern per commit. Never bundle unrelated changes.
- **Detailed bodies**: explain the *why*, list notable decisions, reference
  the GDD/brand pack when content is derived from them.
- All commits must be **GPG-signed** (enforced by git config + YubiKey).
- Hooks: `git config core.hooksPath .github/hooks` installs gitleaks
  (pre-commit) and commitlint (commit-msg). Hooks require `gitleaks` and the
  npm dependencies (`npm ci`) on the machine.

## TDD (mandatory)

Develop with **Red → Green → Refactor** using Pest:

1. **Red** — write failing tests in `tests/Unit` / `tests/Feature`; commit
   with `test: …`.
2. **Green** — implement the minimum to pass; commit with `feat: …` /
   `fix: …`.
3. **Refactor** — clean up while green; commit with `refactor: …`.

Run the suite with `./vendor/bin/pest --no-coverage` (coverage drivers are
optional locally). Arch tests enforce strict types and ban debug functions in
`Hexforged\Web`.

## Pull request flow (mandatory)

1. Push the branch as `kyau`.
2. Open the PR **as `kyaulabs-bot`** (base `develop`, or `main` for releases).
   Fill in `.github/PULL_REQUEST_TEMPLATE.md` completely — Summary, Changes by
   Phase, Verification, and the **Test Plan** with concrete, runnable
   checkbox items.
3. **Execute every Test Plan item one by one** and tick each checkbox only
   after it passes (`gh pr edit` to update the body). If any item fails, fix
   on the branch and re-run the whole list.
4. When all items are green **and** CI is green, sign off: approve the review
   **as `kyau`**.
5. Merge **as `kyaulabs-bot`** (merge commit; do not squash unless the PR is a
   single atomic change). Delete the branch after merge.

## CI/CD

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `test.yml` | PRs + pushes to `develop`/`feat/**`/`fix/**` | Pest on PHP 8.5, JS syntax check, commitlint, gitleaks |
| `release.yml` | tags `v*` | git-cliff notes, deployable tarball, GitHub release |
| `back-merge.yml` | pushes to `main` | automated PR `main` → `develop` (authenticates with the `KYAULABS_BOT_TOKEN` repo secret; org policy blocks `GITHUB_TOKEN` from creating PRs) |

## Definition of done

- Pest suite green locally and in CI.
- Commitlint and gitleaks green.
- PR Test Plan fully executed and checked off; approved by `kyau`; merged by
  `kyaulabs-bot`.
- [CONTEXT.md](CONTEXT.md) updated when domain knowledge or architecture
  decisions change.
