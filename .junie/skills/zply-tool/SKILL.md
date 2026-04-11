# Skill : Création d'un Nouvel Outil Zply

Ce skill définit la méthodologie standard pour créer et intégrer un nouvel outil dans l'écosystème Zply. Il garantit la cohérence UI/UX, la performance et le respect des principes techniques du projet.

## 🏗 Structure de l'Outil

Chaque outil doit être isolé dans son propre répertoire sous `app/[locale]/[tool-id]`.

### 📂 Architecture des Fichiers
```text
app/[locale]/[tool-id]/
├── page.tsx                 # Point d'entrée SSR (Métadonnées & Wrapper)
├── [ToolId]Client.tsx       # Composant Client principal (Layout & Orchestration)
├── [ToolId]Toolbar.tsx      # Barre d'actions spécifique à l'outil
├── use-[tool-id]-state.ts   # Gestion de l'état (Input, Options, ViewMode)
├── use-[tool-id]-transformation.ts # Logique métier (Calculs, Conversions)
├── [tool-id].types.ts       # Interfaces et types spécifiques
├── [tool-id].utils.ts       # Fonctions utilitaires pures
└── [tool-id].default.ts     # Données par défaut (ex: snippets, exemples)
```

---

## 🚀 Étape 1 : Enregistrement dans la Config

Avant toute implémentation, l'outil doit être déclaré dans `lib/config/tools.ts`.

1. **Ajouter l'ID** dans l'énumération `ToolId`.
2. **Ajouter la configuration** dans le tableau `TOOLS`.
   ```typescript
   {
     id: ToolId.MY_NEW_TOOL,
     href: '/my-new-tool',
     icon: MyIcon, // LucideIcon
     status: 'active', // ou 'coming-soon'
     category: Category.DATA,
     showInSidebar: true, // Optionnel
     libs: [{ name: 'LibraryName', url: 'https://...' }] // Optionnel
   }
   ```

---

## 🎨 Étape 2 : Guidelines UI/UX (Style "Zply")

### 1. Layout Standard : `ToolPageLayout`
Tous les outils doivent utiliser `ToolPageLayout` pour assurer la consistance du header, breadcrumb et footer.
```tsx
<ToolPageLayout
  toolId={ToolId.MY_TOOL}
  title={t('my-tool.title')}
  icon={<MyIcon />}
  breadcrumbItems={[{ label: tCategories(Category.DATA), href: '/?category=Data' }]}
  headerActions={<MyToolToolbar />}
  footerIndicator={<MyStatusIndicator />}
>
  {/* Contenu principal */}
</ToolPageLayout>
```

### 2. Outils de type Éditeur + Preview
Utiliser systématiquement `EditorPreviewWorkspace`. Il gère :
- Le redimensionnement (Resizable Panels).
- Les modes de vue (`editor`, `split`, `preview`).
- Les transitions Framer Motion.
- Le responsive mobile.

### 3. Composants Communs
- **Boutons** : Utiliser `variant="secondary"` pour les actions neutres et `variant="ghost"` pour les actions discrètes dans la toolbar.
- **CopyButton** : À inclure systématiquement pour tout résultat textuel.
- **MonacoEditor** : Utiliser le wrapper `MonacoEditor` avec le thème synchronisé via `resolvedTheme`.

---

## ⚙️ Étape 3 : Persistence & État (Zéro Backend)

Toute la persistance passe par l'URL.

### 🔗 `useShareableState`
Utiliser ce hook pour synchroniser l'input utilisateur avec le `window.location.hash`.
```typescript
const [content, setContent] = useShareableState<string>('c', defaultContent);
```
- Le premier paramètre est une clé courte (ex: 'c', 'v', 'o') pour minimiser la taille de l'URL.
- L'état est automatiquement compressé en LZ-String.

### 🔄 Synchronisation avec `requestAnimationFrame`
Pour éviter les erreurs d'hydratation et les re-renders excessifs lors de la récupération de l'état depuis l'URL :
```typescript
useEffect(() => {
  const frame: number = requestAnimationFrame(() => setState(val));
  return () => cancelAnimationFrame(frame);
}, [val]);
```

---

## 🌍 Étape 4 : Internationalisation (i18n)

1. **Traductions Générales** : Ajouter dans `messages/en.json` et `messages/fr.json` sous le namespace `Tools.[tool-id]`.
2. **Usage** : `const t = useTranslations('Tools');` et accès via `t('[tool-id].title')`.

---

## 🔐 Étape 5 : Privacy & API Calls

Conformément au manifeste "Zéro Backend", aucune donnée ne doit transiter par un serveur intermédiaire géré par Zply.

1. **Client-side Only** : Tous les traitements doivent être effectués dans le navigateur.
2. **Appels Externes** : Si un outil nécessite une API externe (ex: `my-ip-info`), l'appel doit être fait directement depuis le client (`fetch` dans un `useEffect` ou via un hook SWR/TanStack Query).
3. **Consentement Utilisateur** : **OBLIGATOIRE**. Si un appel API externe doit être effectué, vous devez demander le consentement explicite de l'utilisateur avant de déclencher la requête. Utilisez le composant générique `PermissionGate` (`components/ui/layout`) pour expliquer pourquoi l'appel est nécessaire et quel service tiers est utilisé.
   ```tsx
   <PermissionGate
     onAccept={triggerFetch}
     loading={loading}
     theme={theme}
     providerUrl="https://api.provider.com"
   />
   ```
4. **Pas de Stockage Local** : Privilégier l'URL (`useShareableState`) au `LocalStorage` pour permettre le partage de l'état.

---

## ✅ Checklist de Validation

- [ ] L'outil est enregistré dans `lib/config/tools.ts`.
- [ ] Les métadonnées SEO sont présentes dans `page.tsx`.
- [ ] L'état principal est synchronisé via `useShareableState`.
- [ ] Aucun préfixe `dark:` n'est utilisé (utiliser `resolvedTheme`).
- [ ] L'outil est parfaitement responsive (testé en vue mobile).
- [ ] Les traductions sont complètes (FR et EN).
