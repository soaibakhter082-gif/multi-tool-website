# PROJECT PLAN

## 1. Project Goal
Build an original, free multi-tool website called **Toolloom**.
The website should help users do quick tasks in the browser.

## 2. Version 1 Scope Rules
- No backend
- No database
- No login
- No payment
- No admin panel
- Mobile responsive
- SEO friendly
- AdSense-ready later (no ads now)
- Beginner-friendly folder structure

## 3. Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS

## 4. Main Architecture Rules
- Use one central tool registry file for tool data.
- Home page must use registry data.
- All Tools page must use registry data.
- Category pages must use registry data.
- Related tools section must use registry data.
- Sitemap must use registry data.
- Do not hardcode tool cards in many places.
- Use reusable components.

## 5. Website Pages
- Home
- All Tools
- Category pages
- Individual Tool pages
- Blog/Guides placeholder
- About Us
- Contact Us
- Privacy Policy
- Terms of Use
- Disclaimer
- Sitemap

## 6. Tool Categories
1. Text Tools
2. Developer Tools
3. Image Tools
4. PDF Tools
5. SEO Tools
6. Calculator/Converter Tools

## 7. Common Tool Page Structure
Each tool page must include:
- Tool title
- Short description
- Input area
- Output area
- Action buttons
- Copy button
- Reset/Clear button
- How to use section
- Example section
- FAQ section
- Related tools section

## 8. SEO Rules
For every tool page:
- Proper page title
- Meta description
- Clean URL
- Helpful content
- FAQ when useful
- Related tool links

## 9. Privacy Rule
If a tool works in browser only, clearly mention:
"Your data is processed in your browser."
Do not make this claim for tools that need server processing.

## 10. Build Phases (High Level)
1. Setup and clean base structure
2. Planning documents
3. Central tool registry
4. Shared layout and reusable components
5. Main listing pages (Home, All Tools, Categories)
6. Tool page template and related tools
7. Implement MVP tools in batches
8. SEO, legal pages, sitemap, final cleanup

## 11. Done Criteria for Version 1
- All listed pages exist
- All 25 MVP tools are working
- All listing pages are registry-driven
- Tool pages follow common layout
- Responsive on mobile and desktop
- Basic SEO metadata added
- No backend dependencies

