This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Responsive structure

The root layout mounts `MobileProvider` from
[`contexts/MobileContext.tsx`](./contexts/MobileContext.tsx). Client components can
call `useIsMobile()` from that module to choose mobile or desktop structure.
It returns `true` at viewport widths of 768px or less, using the shared
`mobileMaxWidth` constant and one media-query change listener.

The value is initially `false` during server rendering and hydration, then
updates to match the viewport after mounting. Conditional trees may remount when
the breakpoint changes; keep state that must survive above those conditionals.

For page-specific breakpoints, use
[`useMediaQuery`](./hooks/useMediaQuery.ts) in a client component:

```tsx
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { XXLargeScreenWidth } from "@/constants/generalConstants";

const isWide = useMediaQuery(`(min-width: ${XXLargeScreenWidth}px)`);
const isCompact = useMediaQuery("(max-width: 600px)");
```

Each hook call owns a media-query change listener, updates when the query changes,
and removes its listener on cleanup. Like `useIsMobile()`, it initially returns
`false` during server rendering and hydration. Prefer `useIsMobile()` for the
shared mobile breakpoint to reuse the provider's listener.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
