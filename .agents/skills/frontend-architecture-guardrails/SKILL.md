---
name: frontend-architecture-guardrails
description: Use when Codex designs, implements, reviews, or refactors frontend code, especially React, Next.js App Router, TanStack Router, TanStack Start, Next-to-TanStack migrations, and OC-ADMIN work, to keep responsibility ownership, cohesive feature/domain structure, route/page and server/client boundaries, UI-to-state mapping, loading/error/Suspense behavior, abstraction boundaries, provider scope, API hooks, utilities, and tests clean.
---

# Frontend Architecture Guardrails

Apply these checks before and during frontend coding. Keep the code pragmatic: cohesive, easy to move or delete, and not over-abstracted.

## First Pass

Before editing, identify:

- Feature boundary: which product capability owns the change.
- State owner: route, page, feature hook, React Query, local component, or context.
- Data flow: API response -> mapper/type -> query hook -> page state/derived data -> UI.
- Side effects: navigation, mutation, cache invalidation, storage, timers, subscriptions.
- UI ownership: which component owns layout, which owns interaction, which only renders.

If any owner is unclear, inspect nearby code first and choose the smallest owner that can naturally contain the behavior.

## Folder Ownership

Prefer feature/domain cohesion over technical buckets for product code.

Recommended shape:

```txt
src/
  routes/       route declarations only
  features/     feature-owned pages, components, hooks, api, types, utils
  shared/       stable cross-feature components, hooks, utils, types
```

Route files should stay thin:

- Do: `createFileRoute`, `beforeLoad`, `loader`, `validateSearch`, params/search parsing, redirects, route-level error/pending components.
- Do not: put large JSX, form state, mutation logic, domain calculations, or feature-only UI helpers in routes.

Feature folders own feature-specific code:

- `features/auth/login/LoginPage.tsx`
- `features/dashboard/list`, `features/dashboard/detail`, `features/dashboard/create`
- `features/review/list`, `features/review/detail`

Use `shared/` only when the code is used by multiple features or is intentionally stable. Do not use `shared/` as a parking lot.

## Responsibility Rules

Separate responsibilities by what changes together:

- Page component: compose feature sections and page-scoped providers.
- Section/container component: arrange UI and own local coordination.
- Leaf component: render one UI concept with narrow props.
- Hook: own interaction state, side effects, query/mutation orchestration, or event translation.
- API module: own endpoint calls only.
- Mapper/adapter: own API-to-view/domain shape conversion.
- Utility: pure calculation, filtering, formatting, parsing, or selection.

Avoid components that fetch, transform, navigate, mutate, and render all in one file.

## Abstraction Rules

Extract only when there is a real reason:

- A name captures a product/domain concept.
- A boundary isolates side effects or API details.
- A pure function becomes testable.
- Repetition has the same reason to change, not just similar syntax.
- A component interface becomes smaller or less coupled.

Do not create generic abstractions just because two blocks look similar. Prefer duplication over a weak abstraction that hides intent.

## State And Providers

Keep provider scope as small as possible:

- App root: QueryClient, router shell, global styles, global devtools, true app-wide auth/session shell.
- Feature page: feature-only contexts, wizard state, selected tab/product/item state shared by several child components.
- Local component: input display state, modal open state, hover/expanded state.

Use React Query for server state. Do not mirror server data into Context unless there is a concrete reason.

For derived data, prefer `useMemo` near the component that needs it, or a pure utility if the rule is domain logic.

## UI 1:1 Mapping

Make UI boundaries follow what the user sees:

- One visible section usually maps to one section component.
- A repeated row/card maps to a leaf component.
- Form display formatting is separate from the persisted domain value.
- Event handlers should accept domain-ish payloads when possible, not raw DOM events deep in hooks.

Example: convert `onChange` event to `{ field, value }` near the UI boundary, then let hooks work with those values.

## TanStack Router Defaults

For TanStack Router or TanStack Start:

- Keep `src/routes/*` as address wiring.
- Use `beforeLoad` for auth/permission redirects before rendering.
- Use `loader` for route-owned prefetchable data.
- Use `validateSearch` for typed query-string state.
- Use `$id` route params and `Route.useParams()` instead of ad hoc URL parsing.
- Keep `routeTree.gen.ts` generated and never edit it manually.

For OC-ADMIN migration, prefer:

```txt
routes/login.tsx              -> imports feature page
features/auth/login/LoginPage.tsx
features/auth/login/hooks/
features/auth/api/
features/dashboard/...
shared/components/
shared/utils/
```

Keep aliases consistent within a migration. Prefer the scaffold alias (`#/*`) unless the repo has already standardized another alias.

## API And Query Layer

Keep endpoint calls boring and typed:

- API function: one endpoint or one cohesive backend action.
- Query hook: owns query key, query function, cache options, and status interface.
- Mutation hook: owns mutation call, invalidation, optimistic behavior if any, and error normalization.
- Mapper: converts backend shape to UI/domain shape when the API shape is noisy or unstable.

Do not let UI components know raw endpoint paths, response envelope quirks, or repeated cache invalidation details.

For detailed guidance on React Query loading/error handling, business errors,
Suspense placement, and Next.js Server/Client Component boundaries, read
`references/front-tip.md` when a task touches those choices.

## Testable Logic

Move these into pure utilities and test when behavior matters:

- filtering, sorting, selection
- number/date formatting and parsing
- API response mapping
- validation rules
- derived status labels
- permission/visibility rules

Prioritize tests for utilities with branching, reused mappers, and logic that could silently regress.

## Red Flags

Pause and restructure when you see:

- A route file with real page implementation.
- A global provider created for one page.
- A component that owns API calls, transformations, mutations, navigation, and layout.
- `shared/` receiving feature-specific code.
- Props named after implementation details like `filteredItems` when the child only needs `items`.
- Type assertions replacing validation or type guards.
- Hooks coupled to a specific UI library's event object without need.
- Copy-pasted loading/error logic across many pages.

## Working Loop

For each frontend change:

1. Inspect nearby structure and name the owner.
2. Place files by ownership, not by habit.
3. Keep route files thin and feature files cohesive.
4. Extract pure logic before it grows inside JSX.
5. Scope providers and state narrowly.
6. Run the smallest meaningful verification: typecheck/build/test or a focused route smoke check.
7. In the final response, mention any ownership or structure choice only if it affects future work.
