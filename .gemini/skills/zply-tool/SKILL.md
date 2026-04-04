---
name: zply-tool
description: Instructions and patterns for creating new high-quality, privacy-focused tools in Zply. Use when asked to add a new tool, implement a feature, or follow Zply's "Zero Backend, URI persistence" manifesto.
---

# Zply Tool Creation Guide

Follow these instructions to implement a new "High Quality" tool in Zply.

## Core Manifesto
- **Zero Backend**: All logic is client-side.
- **Privacy First**: No cookies, no trackers, no external analytics.
- **URI Persistence**: All state must be compressed and stored in `window.location.hash` via `useShareableState`.

## Tool Creation Workflow

1. **Declare in `lib/config/tools.ts`**:
   - Add a unique `ToolId`.
   - Add a `ToolConfig` to `TOOLS` with title, description, and status.
   - Assign the correct `category`. Styling is now automatically derived from the category.
   - List used libraries in the `libs` property for automatic footer credits and "Powered By" section.

2. **Create Page Directory**:
   - Create `app/[tool-id]/`.
   - Use a modular structure for complex tools:
     - `page.tsx`: The orchestrator (UI only) + SEO Metadata.
     - `[ToolId]PageClient.tsx`: The client-side entry point.
     - `use-[tool-id]-*.ts`: Domain-specific hooks (logic).
     - `[ComponentName].tsx`: Sub-components for better readability.
     - `[tool-id].types.ts`: TypeScript definitions.
     - `[tool-id].utils.ts`: Pure functions.

3. **SEO & Metadata (Critical)**:
   - In `app/[tool-id]/page.tsx`, export a `metadata` object of type `Metadata`:
     ```tsx
     export const metadata: Metadata = {
       title: 'Tool Name | Zply',
       description: 'Specific tool description for search engines.',
       openGraph: {
         title: 'Tool Name | Zply',
         description: '...',
         url: 'https://zply.dev/[tool-id]',
       },
       twitter: {
         title: 'Tool Name | Zply',
         description: '...',
       },
       alternates: {
         canonical: 'https://zply.dev/[tool-id]',
       },
     };
     ```

4. **Performance & Monaco Editor**:
   - **NEVER** import `@monaco-editor/react` directly in page components.
   - **ALWAYS** use the optimized `@/components/monaco-editor` component.
   - This component uses `next/dynamic` with `{ ssr: false }` to reduce the initial bundle size and improve Core Web Vitals (LCP/FID).

5. **Implement UI with `ToolPageLayout`**:
   - Wrap everything in `ToolPageLayout`.
   - Provide `toolId`, `title`, `icon`, and `breadcrumbItems`.
   - `ToolPageLayout` automatically handles:
     - **Structured Data (JSON-LD)**: Injects `WebApplication` schema for SEO.
     - **Semantic HTML**: Uses `<h1>` for the tool title.
     - **"About" Section**: Pushes an "About this tool" section below the fold for SEO.
     - **Navigation**: Adds an "Info" button in the header to scroll to the About section.

6. **Modular Architecture & Technical Domains**:
   - **Hooks**: Split logic into specialized hooks:
     - `use-[tool]-state.ts`: Persistence and core state.
     - `use-[tool]-transformation.ts`: Core processing logic (useMemo).
     - `use-[tool]-action.ts`: Side effects (downloads, uploads).
   - **Naming**: Hooks MUST follow `use-*.ts` (kebab-case). Components MUST use `PascalCase.tsx`.

7. **Manage State with `useShareableState`**:
   - Use `const [state, setState] = useShareableState<T>(key, defaultValue)`.
   - Use short keys (e.g., 'h', 't', 'json') for URI efficiency.

8. **(Optional) Add Editor & Preview**:
   - Use `EditorPreviewWorkspace` for tools needing an editor and a live preview.
   - Use `useViewMode` hook to manage display modes (editor, split, preview).

9. **Update `README.md`**:
   - Add the new tool to the `## 🛠 Available Tools` section in `README.md`.
   - Use the format: `- **[Tool Name](/tool-uri)**: Description.`
   - Ensure it is placed in the correct category.

## Visual Guidelines
- **Bordures**: Use `border-island-border` (1px).
- **Glassmorphism**: Apply `glass-island` class to containers.
- **Animations**: Use `framer-motion` for smooth transitions.
- **Layouts**: Use `EditorPreviewWorkspace` to automate split-screen behavior.
- **Folding**: The interactive workspace is forced to `min-h-full` to push SEO text below the fold.

## Advanced Patterns
- **Hydration Sync**: Use `requestAnimationFrame` in `useEffect` for state updates during hydration.
- **Typing**: Strict TypeScript. Always type `useState<T>`, `useShareableState<T>`, and function returns.
- **Explicit Rendering**: Follow multi-line ternary and logical `&&` formatting as per `GEMINI.md`.

---

### Resources
- **Configuration**: See [references/config.md](references/config.md) for enum and registry details.
- **UI Patterns**: See [references/ui.md](references/ui.md) for Tailwind classes and layouts.
- **Hooks**: See [references/hooks.md](references/hooks.md) for state and view management.
- **Templates**: See [assets/templates/](assets/templates/) for boilerplate code.
