# Zply UI & Tailwind Guide

Consistent aesthetics are key for Zply ("Zply style").

## 1. Glassmorphism Patterns
Use the `glass-island` class for main containers to achieve the frosted glass effect.

```tsx
<div className="glass-island rounded-4xl p-8 border border-island-border shadow-2xl">
  {/* Content */}
</div>
```

## 2. Standard Tailwind Classes
- **Main BG**: `bg-island-bg`
- **Card BG**: `bg-island-card`
- **Borders**: `border-island-border` (for subtle separators)
- **Accents**: Use `getCategoryClasses(CATEGORY_COLORS[Category.X])` from `@/lib/config/categories` to get a unified theme object:
  - `theme.text`: Category text color (e.g., `text-blue-400`)
  - `theme.bg`: Category background color (e.g., `bg-blue-500`)
  - `theme.icon`: Light background with text color (e.g., `bg-blue-500/10 text-blue-400`)
  - `theme.hoverBorder`: Border color on hover
  - `theme.hoverText`: Text color on hover
  - `theme.selection`: Selection background color

## 3. Tool Layout with `ToolPageLayout`
The basic workspace structure. It automatically handles `<h1>` for the tool title, JSON-LD injection, and an "About" section below the fold.

```tsx
<ToolPageLayout
  toolId={ToolId.HASH}
  title="My Tool"
  icon={<Hash className="w-5 h-5" />}
  workspaceClassName="md:flex-row" // side-by-side
>
  {/* Workspace Content */}
</ToolPageLayout>
```

## 4. Performance: Monaco Editor
**NEVER** use `@monaco-editor/react` directly. Use the optimized `@/components/monaco-editor` component to ensure dynamic loading and zero SSR.

```tsx
import MonacoEditor from '@/components/monaco-editor';

<MonacoEditor
  height="100%"
  language="json"
  value={content}
  onChange={setContent}
/>
```

## 5. Header Actions & Footer Indicators
- **Header Actions**: For formatting, minification, or view mode toggles.
- **Footer Indicators**: Use for status (Valid/Invalid) or real-time stats. Add a `Zap` icon for "Real-time" indicators.
- **Info Button**: `ToolPageLayout` adds an "About" button automatically in the header that scrolls to the SEO content section.

## 6. Animations
Use `framer-motion` for entrances:
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  {/* Animating content */}
</motion.div>
```

## 7. Content Folding
The main workspace island is set to `min-h-full` to push the SEO "About" section below the fold, prioritizing the tool UI for users.
