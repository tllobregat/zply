# Custom Hooks for Zply

Standardized hooks for persistence and view management.

## 1. `useShareableState<T>(key: string, defaultValue: T)`
Syncs component state with the `window.location.hash`.

```tsx
import { useShareableState } from '@/hooks/use-shareable-state';

const [content, setContent] = useShareableState<string>('c', 'default');
```
- **Constraint**: Use short keys ('c', 'v', 'k') to minimize URL length.
- **Privacy**: All compression happens client-side (LZ-String).

## 2. Technical Domain Hook Splitting
For complex tools, **NEVER** keep all logic in `page.tsx`. Split logic into specialized hooks:

- `use-[tool]-state.ts`: Persistence and input state.
- `use-[tool]-transformation.ts`: Memoized business logic and results.
- `use-[tool]-file.ts`: File handling (uploads/downloads).
- `use-[tool]-actions.ts`: Other side effects or complex event handlers.

**Naming Convention**: All hook files MUST follow the `use-*.ts` pattern (kebab-case).

```tsx
// use-mytool-transformation.ts
export function useMyToolTransformation(input: string) {
  return useMemo(() => transform(input), [input]);
}
```

## 3. `useViewMode(defaultMode: ViewMode)`
Manages view modes for editor-based tools.

```tsx
import { useViewMode } from '@/hooks/use-view-mode';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';

const { viewMode, setViewMode } = useViewMode('split');
```
- **Modes**: `'editor'`, `'preview'`, or `'split'`.
- Pass to `EditorPreviewWorkspace` and `ViewModeToggle`.

## 3. Hydration Sync (Pattern)
To avoid hydration errors with URL-synced states, wrap initialization in `requestAnimationFrame`.

```tsx
useEffect(() => {
  const frame: number = requestAnimationFrame(() => {
    // Initial sync logic if needed beyond useShareableState
  });
  return () => cancelAnimationFrame(frame);
}, []);
```
