# James & Claire — Wedding invitation

A complete, dependency-free HTML/CSS/JavaScript website with a Vercel RSVP function. Built around the supplied invitation reference: olive ink, white space, botanical flourishes, handwritten names, softly faded photographs, rounded image masks, and a restrained vertical timeline.

## Start in VS Code

1. Extract this ZIP and open the `wedding-invitation` folder in VS Code.
2. Install Node.js 20 or newer if it is not already installed.
3. Open **Terminal → New Terminal** and run:

```sh
npm run dev
```

4. Open **http://localhost:3000**. Stop the server with **Control+C** in the terminal.

No `npm install` is needed; this project has no package dependencies. The included server serves both the website and RSVP endpoint. VS Code Live Server can preview `public/index.html`, but cannot execute the RSVP function.

## Folder structure

```text
wedding-invitation/
  public/
    index.html              Semantic page and editable story/timeline copy
    style.css               Responsive layout, typography, motion
    config.js               Names, date, venue, deadline, video path
    app.js                  Countdown, calendar, dialogs, form, reveals
    assets/
      fonts.css             Local font-face declarations
      fonts/                Bundled typefaces
      botanical.webp        Botanical accent from supplied recording
      couple.webp           Hero / gallery crop from supplied screenshot
      story.webp            Veil portrait from supplied screenshot
      landscape.webp        Closing / gallery crop from screenshot
      venue.webp            Clean venue crop from supplied recording
      party.webp            Wedding party crop from supplied recording
      attire-ladies.webp    Attire reference crop
      attire-gentlemen.webp Attire reference crop
      favicon.svg
  api/rsvp.js               Vercel function; validation and webhook delivery
  scripts/dev.mjs           Local server
  scripts/rsvp.test.mjs     Endpoint checks (mocked delivery)
  references/              Original screenshot and recording, not deployed
  .env.example             Server-only integration settings
  .gitignore
  package.json
  vercel.json
  DESIGN-NOTES.md
```

## Personalise before sharing

Edit `public/config.js` for the names, wedding date/time, venue, address, time zone, response deadline, and optional video. The monogram, dates, names, countdown, calendar event, document title, and directions URL update from these values.

The date uses an explicit UTC offset. The sample date is **May 21, 2027 at 3:30 PM, America/Los_Angeles**, matching the date and location in the reference; the schedule, story copy, attire guidance and guest limit are illustrative. Confirm the venue/address before sending the invitation. Edit `public/index.html` for timeline times, story, gallery captions, image alt text, metadata, and meal options. If changing meal choices or maximum guest count, also update validation in `api/rsvp.js`. Edit `public/assets/favicon.svg` to change its monogram.

Replace the WebP crops with full-resolution originals at the same paths. Keep the aspect ratios similar and update image alt text if needed. The supplied sources are a 550×996 screenshot and a 320×522 screen recording; extracted photos cannot provide high-resolution wedding photography. Browser enlargement will look soft, especially on desktop. No substitute stock photographs have been introduced.

## Optional cinematic background video

The uploaded MOV is a recording of a website displayed inside a phone frame, not clean wedding footage. It is retained in `references/` for design provenance, not used as an intrusive background.

Add an H.264 MP4 without audio at `public/assets/hero.mp4`, then set `heroVideo: 'assets/hero.mp4'` in `config.js`. Use a short clip, ideally under 5 MB. The photo remains the fallback. The player has a play/pause control, pauses in hidden tabs, and skips autoplay for reduced-motion/data-saving preferences. Autoplay refusal does not prevent use of the site. Clear `heroVideo` to use the original still-photo design.

## Enable live RSVP delivery

The form is fully validated in the browser and again on the server. Delivery is intentionally unconfigured because no guest-response destination was supplied. It does **not** store responses in the visitor's browser or claim delivery without a successful server response.

1. Provide an HTTPS webhook endpoint that durably saves the incoming JSON, for example your own service or a configured automation workflow.
2. Set `RSVP_WEBHOOK_URL` to that endpoint. Optionally set `RSVP_WEBHOOK_TOKEN` if it expects bearer authentication.
3. Locally, copy `.env.example` to `.env.local`, fill the variables, and restart `npm run dev`.
4. On Vercel, add the variables under the project's **Settings → Environment Variables**, then redeploy.
5. Submit a test RSVP and verify it reached the destination before sharing the site.

The webhook receives `name`, `email`, `attendance` (`yes`/`no`), `guests` (0 for a decline), `meal`, `notes`, and `receivedAt` (ISO timestamp). A 2xx response must mean the destination accepted the record. Configure duplicate handling in that destination, ideally by normalised email. The function uses a 10-second timeout; ambiguous delivery failures ask the guest to contact the hosts before retrying.

Secrets must never go in `public/config.js` or any other public file. This is a public RSVP form with a honeypot, not an invitation-code authentication system. For a widely shared URL, configure rate limits using your hosting provider or webhook destination. This project does not include a guest admin dashboard, database, or email account.

## Deploy on Vercel

Option A — Git import:

1. Push the extracted project to a Git repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Set **Root Directory** to the directory containing `package.json` and `vercel.json`.
4. Choose **Other** for the framework. Leave the build command empty and use **public** as the output directory (already declared in `vercel.json`). There is no dependency install/build step required.
5. Add the RSVP environment variables if ready, then deploy.

Option B — terminal from this project directory:

```sh
npx vercel
npx vercel --prod
```

Follow the CLI sign-in/project prompts. The first command creates a preview; the second publishes production. Vercel serves `public/` and detects the Node function at `api/rsvp.js`. No rewrites are necessary for this single-page anchor-navigation site. The original files in `references/` are outside the public output directory.

Official references: https://vercel.com/docs/project-configuration/vercel-json and https://vercel.com/docs/deployments/overview

## Checks and accessibility

```sh
npm run check
npm test
```

The tests exercise validation, missing configuration, positive delivery, declines, and failed delivery using a mocked webhook; they do not send a guest message. The site uses semantic headings, explicit form labels, visible focus states, native modal dialogs with Escape/focus handling, keyboard gallery arrows, lazy-loaded secondary images, and reduced-motion support. Native CSS/IntersectionObserver animations keep this design dependency-free; GSAP is unnecessary for the restrained reference motion.

No browser automation was available in the build environment, so visual behaviour and cross-browser compatibility have not been browser-tested. Before launch, inspect 375 px mobile, 768 px tablet, and 1440 px desktop layouts in Chrome, Safari, Firefox, and Edge. Confirm the mobile menu, Escape/arrow keys, calendar download, countdown timezone, reduced-motion preference, and one real RSVP delivery.

## Fonts and reference rights

Bundled Google Fonts: Bodoni Moda, Cormorant Garamond, Italianno (SIL Open Font License; license files under `public/assets/fonts/`). All photo and botanical assets are crops from the files you supplied. Confirm you have permission to publish the reference photography and artwork before using the site publicly.
