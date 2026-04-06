---
name: "🛠️ Refactor / Technical Debt"
about: "Propose internal code improvements, optimizations, or documentation updates."
title: "[CHORE]: "
labels: ["chore", "performance", "documentation"]
assignees: ""
---

### 🧹 Refactor Summary
A clear and concise description of the code area or logic that needs cleaning up.

### 🎯 Objective
What is the primary goal of this refactor?
- [ ] **Performance:** (e.g., Reducing bundle size, optimizing Monaco Editor loading).
- [ ] **Architecture:** (e.g., Moving logic into `use-*.ts` hooks, modularizing `utils`).
- [ ] **Documentation:** (e.g., Updating `README.md` or adding inline JSDoc).

### 🧩 Scope of Changes
Which parts of the project are affected?
* **Page Directory:** (e.g. `app/[tool-id]/`)
* **Shared Components:** (e.g. `components/monaco-editor`)
* **Hooks/Utils:** (e.g. `lib/hooks/use-shareable-state.ts`)

### 🛠 Proposed Solution
Briefly describe how you plan to refactor the code. Does it follow the existing **Tool Creation Guide** or **GEMINI.md** patterns?

### 🧪 Impact & Verification
* **Breaking Changes:** Will this change any existing URI persistence hashes or tool behaviors?
* **Testing:** How will we verify that the logic remains identical after the refactor?

### ➕ Additional Context
Add any relevant code snippets, performance benchmarks (Lighthouse/Bundlephobia), or related issues.
