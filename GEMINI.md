# Zply - Technical Manifesto & Guidelines

## 🚀 Vision
Zply est "The Swiss Army Knife for Your Daily Tasks". Une boîte à outils "High Quality", ultra-rapide et respectueuse de la vie privée, conçue pour les professionnels du numérique.
**Principe de base :** Zéro Backend. Zéro Cookie. Zéro Database. Toute la persistance passe par l'URI pour faciliter le partage.

## 🏗 Architecture (Next.js App Router)
- **Framework :** Next.js (SSG de préférence pour le SEO).
- **Style :** Tailwind CSS + Shadcn/ui (Radix UI).
- **Composants :** Architecture par "Islands". Chaque outil est isolé.
- **Routing :** Subdirectories pour le SEO (`/plantuml`, `/markdown`).
- **Data Persistence :** Compression LZ-String dans le `window.location.hash` via `useShareableState`.

## 🎨 UI/UX Guidelines (Style "Zply")
- **Thème :** Dark Mode par défaut (Islands contrastées).
- **Mode Sombre / Clair :** **INTERDIT** d'utiliser le préfixe Tailwind `dark:`. Toujours utiliser `resolvedTheme` (via `useTheme`) pour appliquer des classes conditionnelles.
- **Navigation :** Barre latérale ou flottante ultra-réactive avec recherche floue (Command Palette).
    - **Logo (Home) :** Le bouton logo de la barre latérale sert à la fois de lien vers l'accueil et de réinitialisation du dashboard. Cliquer dessus sur la page d'accueil déclenche un événement `reset-dashboard` et scrolle vers `#dashboard`.
    - **Dashboard Home :** La page d'accueil du dashboard (vue "All") doit inclure une section Hero claire définissant la proposition de valeur de l'application (100% privé, local-first) et une section "Popular Tools" pour un accès rapide aux outils les plus utilisés.
- **Esthétique :**
    - Bordures fines (1px) `border-island-border`.
    - Effets de verre (Glassmorphism) sur les modaux et la navigation ("Glass Island").
    - Accents de couleur : Bleu Zply (`#3b82f6`) ou Violet Énergie.
    - **Border Radius :** Utiliser des arrondis plus petits pour un look moderne. Standard : `3xl` (1.5rem) pour les conteneurs principaux, `xl/2xl` (0.75rem - 1rem) pour les cartes et `lg/xl` (0.5rem - 0.75rem) pour les boutons et inputs.
    - **Shadows :** Utiliser des ombres douces et légères pour compléter les arrondis réduits. Préférer `shadow-xl` ou `shadow-2xl` pour les conteneurs principaux et `shadow-md` ou `shadow-lg` pour les éléments interactifs.
- **Performance :** LCP < 1.2s. Aucun chargement bloquant.
- **Workspace Layout** : Utiliser `ToolPageLayout`. Par défaut en colonne, passer en `flex-row` via `workspaceClassName` pour les outils de type Éditeur + Preview.

## ⚙️ Global Coding Standards

### 1. Typage Explicite (TypeScript)
- **Règle d'or** : Tout doit être typé explicitement. Pas d'inférence implicite pour les variables importantes.
- **Invalide** : `const a = '';`
- **Valide** : `const a: string = '';`
- Typage obligatoire pour :
    - Les états (`useState<T>`, `useShareableState<T>`).
    - Les paramètres de fonction et types de retour.
    - Les variables locales complexes.
    - Les constantes d'objets ou de tableaux.

### 2. Hydratation & Synchronisation
- **Réduction des Rerenders** : Pour les mises à jour d'état dès l'initialisation (hydration) ou dépendantes de sources externes (URL params, LocalStorage) dans un `useEffect`, utiliser **systématiquement** `requestAnimationFrame` pour éviter les erreurs de "cascading renders" et synchroniser avec le cycle de rendu du navigateur.
- **Exemple** :
```tsx
useEffect(() => {
  const frame: number = requestAnimationFrame(() => setState(val));
  return () => cancelAnimationFrame(frame);
}, [val]);
```
- Nettoyer via `cancelAnimationFrame` dans le retour de l'effet.

### 3. Readability & Code Style
- **Nested Ternaries** : NEVER use nested ternaries. Use separate variables, helper functions, or logic blocks to keep the code readable and maintainable.
- **Ternary & Logical Formatting** : When using a ternary or logical `&&` for rendering in JSX, follow this exact multi-line structure:
```tsx
{
  condition
    ? (
      <TrueComponent />
    )
    : (
      <FalseComponent />
    )
}

{
  condition
  && (
    <Component />
  )
}
```
- **Nested Components** : NEVER define components or helper functions that return JSX inside another component's body. Move them to the top level of the file or a separate file to avoid React code smells and performance issues.
- **Explicit Returns** : Favor early returns and clear logic paths over deeply nested conditional blocks.

## 🛠 Tool Implementation
Pour la création et la gestion des outils, utiliser le skill specialized `zply-tool`.
- **Command** : `activate_skill zply-tool` pour obtenir les instructions complètes, les patterns UI et les templates.
- **Scope** : Registry (`tools.ts`), Layout (`ToolPageLayout`), État (`useShareableState`), et Preview (`EditorPreviewWorkspace`).

## 🔐 Privacy & Security
- Aucune donnée utilisateur ne quitte le navigateur (Client-side Only).
- Pas de trackers tiers ni cookies.
- Pas de stockage local persistant (LocalStorage) si possible, privilégier l'URL.

## 📊 Performance & Optimization
- **Filtrage** : Utiliser `useMemo` sur les recherches et catégories pour éviter les recalculs coûteux.
- **Images** : Privilégier le SVG ou les icônes Lucide.
- **LCP** : Garder un bundle léger, utiliser `next/dynamic` si nécessaire pour les composants lourds (comme Monaco Editor).

## 📝 Git Workflow
- **Commit Pattern** : Toujours effectuer un commit après chaque tâche terminée.
- **Convention** : Utiliser les [Conventional Commits](https://www.conventionalcommits.org/) (nécessaire pour `standard-version`).
- **Format** : `<type>(<scope>): <message>` (ex: `feat(ui): add new button`, `fix(core): resolve race condition`).
- **Types recommandés** : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
