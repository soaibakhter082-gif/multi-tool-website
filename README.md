# ToolSpark - Free Multi-Tool Website (Version 1)

ToolSpark is an original multi-tool website built with:

- Next.js
- TypeScript
- Tailwind CSS

Version 1 is fully frontend-only:

- No backend
- No database
- No login
- No payment
- No admin panel

Many tools process data directly in the browser.

## What Is Already Built

Pages:

- Home
- All Tools
- Category pages
- Individual tool pages
- Guides placeholder
- About Us
- Contact Us
- Privacy Policy
- Terms of Use
- Disclaimer
- Sitemap page

Tool categories:

- Text Tools
- Developer Tools
- Image Tools
- PDF Tools
- SEO Tools
- Calculator and Converter Tools

MVP tools (25) are implemented.

## Important Architecture Rule

All tools come from one central registry:

- `data/tool-registry.ts`

The registry is reused by:

- Home page
- All Tools page
- Category pages
- Tool pages
- Related tools
- Sitemap page

Do not hardcode tool cards in many places. Add tools to registry first.

## Project Structure (Beginner View)

- `app/` -> website pages (routes)
- `components/` -> reusable UI parts
- `data/` -> central tool/category data
- `lib/tools/` -> tool logic and helper functions
- `types/` -> TypeScript types
- `PROJECT_PLAN.md` -> full plan
- `FEATURE_LIST.md` -> feature summary
- `PAGE_STRUCTURE.md` -> page map
- `UI_GUIDE.md` -> UI style guide
- `CODEX_TASKS.md` -> step-by-step progress checklist

## How To Run

```bash
npm install
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

Quality checks:

```bash
npm run lint
npm run build
```

## How To Add a New Tool (Simple Flow)

1. Add tool entry in `data/tool-registry.ts`
2. Add tool logic in `lib/tools/` (choose existing group file or create a new one)
3. Connect UI in a workspace component under `components/tool/`
4. Update dynamic tool route in `app/tools/[slug]/page.tsx` if needed
5. Add example content in `lib/tools/tool-page-content.ts`
6. Run lint/build

## SEO Notes (Version 1)

- Each key page has title + description metadata.
- Tool pages generate metadata using slug data.
- Clean URLs are used with App Router.
- Internal links are added across core pages and tool pages.

## Privacy Notes (Version 1)

When a tool is browser-only, the UI shows that data is processed in the browser.
Do not claim browser-only processing for a tool if server processing is added later.

## Suggested Version 2 Ideas

- Add backend APIs for heavy processing
- Optional user accounts
- Save tool history for users
- Real blog system (CMS or markdown)
- XML sitemap route and robots metadata route
- AdSense integration (carefully placed, performance-safe)

## Final Status

Version 1 foundation is complete and beginner-friendly.
You can now improve content, add more tools, and prepare deployment.
