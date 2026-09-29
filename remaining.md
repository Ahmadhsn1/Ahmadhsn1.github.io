# Portfolio Redesign: Remaining Work

Last updated: 2026-09-29

## ✅ Done

- **New color scheme, "Obsidian & Ember":** near-black `#09090B` background, ivory text `#F2EFE8`, ember orange `#FF6A3D` accent and gold `#FFC56E` highlights (`src/styles/tokens.css`).
- **New fonts:** Geist (body), Instrument Serif italic (accent words) and Geist Mono (code and labels).
- **Full redesign of every section:** glass nav, hero with stats, tech marquee, bento project grid with spotlight hover, new **Process** section, About with a toolbox, a large Contact CTA card, and the footer.
- **2D animated SVG developer character** (`src/components/DevCharacter.jsx`). It runs a 6-step story: typing → thinking → bug → fix → tests pass → coffee + git push.
- **Live code editor** synced with the character (`src/components/CodeEditor.jsx`): the code types itself, a bug gets highlighted, the fix is typed and the terminal shows the output.
- Step buttons (Code / Think / Debug / Fix / Test / Ship), mouse parallax, reduced-motion support, and the animation pauses when off-screen.
- `npm run lint` and `npm run build` both pass.

## ⏳ Remaining

### 1. 3D character (in progress, not connected yet)
- `src/components/three/Dev3D.jsx` is **written but not yet connected**. It's a Three.js / React Three Fiber character built from code with the same 6 actions.
- Dependencies are already installed: `three`, `@react-three/fiber`, `@react-three/drei`.
- Still to do:
  - [ ] Lazy-load `Dev3D` in `src/components/DevScene.jsx` with `React.lazy` and `Suspense`. Pass `phase={phase.id}`, `active={onScreen}` and `reduceMotion`.
  - [ ] Use the SVG `DevCharacter` as a fallback when WebGL isn't available.
  - [ ] CSS: give `.stage-character` an `aspect-ratio: 1.12` in 3D mode, plus a `.dev-canvas` fill and a `.thought-bubble` style.
  - [ ] Tune the camera, arm poses (`ARM_POSES`) and hair shape by looking at screenshots.
  - [ ] Remove the unused `piece` variable (line ~546).
- **Note:** a Pixar-quality look (exactly like the reference image) needs a real 3D model (GLB). The best route: generate a model from the reference image in Meshy.ai or Tripo3D, rig and animate it in Mixamo (typing, thinking, cheering, drinking), then load it with `useGLTF` and `useAnimations`.

### 2. Polish
- [ ] Mobile check (≤620px): stacked editor and character layout.
- [ ] In the Coffee phase, move the held mug slightly left so it covers the mouth properly.
- [ ] At a 1440×730 viewport, "quietly works" wraps onto 2 lines; check the headline size.
- [ ] Project images come from Unsplash; replace them with real product screenshots.

### 3. Deploy
- [ ] Deploy to Vercel or Netlify (`npm run build` → `dist/`).
- [ ] Add an OG image, favicon and meta tags.

## Run locally

```bash
npm install
npm run dev
```
