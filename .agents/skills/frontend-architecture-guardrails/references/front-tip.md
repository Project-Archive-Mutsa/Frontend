# Frontend Tip Reference

Use this reference when a frontend task touches Next.js App Router
Server/Client Component boundaries, React Query loading/error handling,
business error modeling, or Suspense placement.

This file distills the user's `front-tip` notes into guardrails for code
generation, review, and refactoring.

## Next.js App Router Boundaries

- Treat `app/page.tsx` and `app/layout.tsx` as Server Components by default.
- Keep `metadata` and `generateMetadata` in Server Components.
- Do not add `"use client"` to a route/page file just to support one
  interactive child.
- Push `"use client"` as far down as practical, near the component that needs
  browser state, events, React Query hooks, or browser APIs.
- When a page needs mostly client behavior but also route metadata, keep a
  server wrapper page and render a client page/component inside it.
- React Query hooks run in Client Components. If server-side first paint matters,
  prefer server prefetch plus hydration instead of turning the whole page into a
  Client Component.

Preferred shape:

```tsx
// page.tsx - Server Component
export const metadata = {
  title: "Posts",
};

export default function Page() {
  return <PostsClientPage />;
}
```

```tsx
// PostsClientPage.tsx
"use client";

export default function PostsClientPage() {
  return <div />;
}
```

## React Query Loading And Error Handling

Use `useQuery` status flags when the screen is small, local, or needs precise
pending/error/refetching behavior:

```tsx
const { data, isPending, isError, error } = useQuery(options);

if (isPending) return <ListLoading />;
if (isError) return <ErrorMessage error={error} />;

return <List items={data} />;
```

Use `useSuspenseQuery` with `Suspense` and an `ErrorBoundary` when a page or
section should centralize loading/error behavior and the child should render
only the success state:

```tsx
<ErrorBoundary>
  <Suspense fallback={<SectionSkeleton />}>
    <Section />
  </Suspense>
</ErrorBoundary>
```

Do not use Suspense only to avoid checking `data | undefined`. Choose it when
the UI boundary, loading sequence, and error ownership are clearer.

## Business Errors Vs Exceptions

Do not model every failure as `throw new Error()`.

Use thrown errors or rejected promises for technical failures:

- network/server failure
- broken API response shape
- missing required infrastructure data
- unexpected runtime errors

Model expected business failures as explicit return state when the UI should
handle them locally:

- forbidden
- not found
- duplicate nickname
- wrong password
- empty title
- deletion blocked by domain rules

Example:

```ts
type GetPostResult =
  | { status: "success"; post: Post }
  | { status: "not_found" }
  | { status: "forbidden" };
```

React Query mutation/query functions may still throw for request failures, but
field-level or domain-level validation should usually render near the relevant
UI instead of going to a global ErrorBoundary.

## Suspense Placement

Suspense is a UI reveal-boundary tool, not a blanket replacement for all loading
states.

Use Suspense when:

- a page or large section is not ready to show on first entry
- the user expects a group of UI to appear together
- a centralized skeleton improves perceived stability

Avoid wrapping every API-calling component independently. That can make the page
appear in scattered timing and weaken information hierarchy.

Do not use Suspense for:

- button pending state
- form submit pending state
- tab/filter/search interactions
- background refetch where existing content should stay visible
- optimistic updates

For background refetch, preserve current data and show a small updating signal:

```tsx
<>
  {isFetching ? <span>Updating...</span> : null}
  <PostList posts={posts} />
</>
```

## Review Checklist

When these topics are in scope, check:

- Is the Server/Client boundary as low as practical?
- Did route/page files stay thin and metadata-capable?
- Is loading/error ownership local, sectional, or route-level by design?
- Are expected business failures modeled explicitly instead of hidden in
  `catch` blocks?
- Is Suspense placed around a user-meaningful reveal unit?
- Are background refetch and optimistic updates handled without replacing
  stable content with skeletons?
