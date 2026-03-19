---
description: Ensure git baseline and commit before changes
---

# Rules of Agents Workflow

This workflow ensures that the project state is always preserved before any major or minor changes are made.

1. **Check Git Status**
   - Verify that git is initialized.
   - If not, run `git init`.

2. **Create Baseline**
   - If there is no "working baseline" commit, run `git add . && git commit -m "working baseline"`.

3. **Commit Before Changes (Policy)**
   - Before applying any edits or running commands that modify the codebase, run:
     ```bash
     git add . && git commit -m "Pre-change snapshot: [Description of work]"
     ```
   - This allows for easy rollback if the change causes issues.
