# Saravanan R — Developer Portfolio

**Full-Stack Developer · FinTech & Digital Lending**

🔗 **Live site:** https://saravanan-22.github.io/

My personal portfolio site. It covers two years of building a digital lending platform used by banks, finance companies and their partner agents, plus my projects, skills, education and what I'm learning next. It's built with Next.js, React Three Fiber and GSAP, with an interactive 3D background and scroll-driven animations.

## Highlights

- **Interactive 3D background:** a WebGL scene built with Three.js and React Three Fiber that reacts to scroll and mouse movement
- **Smooth, scroll-driven motion:** Lenis smooth scrolling with GSAP and Motion animations, plus text scramble, odometer counters, tilt-glare cards and a magnetic custom cursor
- **Skill deck:** four core-strength cards that deal out from a fanned deck when the section scrolls into view, then flip over in 3D on hover or tap to show where each skill was used
- **LendOCR case study:** my OCR API for Indian KYC and loan documents, with real API responses, live mini-demos (number validation, bank statement analysis, API keys and rate limits, background job queue), the request pipeline, tech stack and real commit history
- **Fast and static:** fully pre-rendered with `output: "export"` and hosted free on GitHub Pages
- **Accessible:** respects `prefers-reduced-motion`
- **Easy to edit:** all text lives in [`src/lib/content.ts`](src/lib/content.ts)

## Sections

Hero · About · Skills · Tech Stack · Experience · FinTech Work · Projects · Education & Certifications · Learning Roadmap · Contact

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, static export), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| 3D | Three.js, React Three Fiber |
| Animation | GSAP, Motion, Lenis |
| Hosting | GitHub Pages via GitHub Actions |

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site written to ./out
```

## Project structure

```
src/
├── app/                 # layout, page, global styles
├── components/
│   ├── sections/        # Hero, About, Experience, Work, Contact …
│   ├── three/           # WebGL background scene
│   ├── ui/              # cursor, loader, reveal, odometer, skill deck …
│   └── visuals/         # animated FinTech module demos
└── lib/
    ├── content.ts       # all portfolio text and data
    └── store.ts         # shared scroll/mouse state for the 3D scene
```

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

## Contact

- LinkedIn: [saravanan-webdeveloper](https://www.linkedin.com/in/saravanan-webdeveloper/)
- GitHub: [@saravanan-22](https://github.com/saravanan-22)
