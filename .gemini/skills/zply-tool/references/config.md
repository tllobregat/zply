# Tool Configuration Guide

Every tool in Zply must be registered in `lib/config/tools.ts`.

## 1. Add Tool ID
Add a unique, lowercase string ID to the `ToolId` enum:

```typescript
export enum ToolId {
  // ... existing tools
  MY_NEW_TOOL = 'my-new-tool',
}
```

## 2. Register in `TOOLS` array
Add a `ToolConfig` object to the `TOOLS` constant. Ensure you select the appropriate category and set `status: 'active'`.

```typescript
{
  id: ToolId.MY_NEW_TOOL,
  title: 'My New Tool',
  description: 'Breve description en français du fonctionnement de l\'outil.',
  href: '/my-new-tool',
  icon: MyIcon, // From lucide-react
  status: 'active',
  category: Category.DATA, // Category enum (styling is derived from this)
  showInSidebar: true, // If it should appear in the primary navigation
  libs: [
    { name: 'library-name', url: 'https://github.com/org/repo' }
  ]
}
```

## 3. Categories
Use one of the following from the `Category` enum:
- `VISUALISATION`
- `DATA`
- `SECURITY`
- `ENCODING`
- `TIME`
- `NETWORK`
