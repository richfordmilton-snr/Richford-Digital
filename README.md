# Richford Digital — Portfolio Starter (Version 5)

A responsive, single-page personal portfolio starter built with HTML, CSS and vanilla JavaScript. Designed to edit in Acode on Android.

## Version 6 updates
- Replaced local-only FAQ response flow with secure backend-ready AI chat integration.
- Added Cloudflare Worker backend using the OpenAI Responses API.
- Added message length validation, limited recent chat history, origin control and error handling.
- AI connection remains disabled until you configure `AI_BACKEND_URL` and deploy the Worker.

## Version 5 updates
- Added the selected profile portrait to the site brand and chatbot header (`assets/richford-profile.jpg`).
- Updated the contact note to reflect the configured email and WhatsApp details.

## Included
- Responsive navigation with mobile menu
- Dark/light theme toggle (preference saved in browser localStorage)
- Active section navigation
- Scroll reveal effects (respects reduced-motion settings)
- Project cards and skill sections
- WhatsApp and email contact links
- Local FAQ chatbot demo (no API, no server, no message transmission)

## Open in Acode
1. Extract this ZIP into a folder.
2. Open `index.html` in Acode.
3. Use Acode's preview/browser to test it.
4. Edit `index.html`, `styles.css`, and `script.js` as needed.

## Before publishing
Contact details are configured in `script.js`:
- Email: `richfordmilton@gmail.com`
- WhatsApp: `233557545740` (international format, without `+`)

Review the text in `index.html` and make sure every skill and project description accurately reflects your experience. Keep unfinished projects labelled as in development. You can change your contact details in `script.js` any time.

## AI chatbot (Version 6 starter)
The chat UI now supports a real AI backend. It is not live until you deploy `backend/worker.js`, add your OpenAI API key as a server-side Worker Secret, and set `AI_BACKEND_URL` in `script.js`. Follow `backend/README.md`. The API key must never be placed in browser-visible files.

## Suggested next stages
1. Confirm personal branding and replace contact placeholders.
2. Add real screenshots and repository/demo links for completed projects.
3. Run accessibility, responsive, link and performance checks.
4. Deploy to GitHub Pages.
5. Build a secure AI backend and investigate WhatsApp Business Platform eligibility/Coexistence.


## Publish free with GitHub Pages
1. Sign in to GitHub and create a new **public** repository, for example `richford-portfolio`.
2. Upload the contents of this project folder to the repository root. Make sure `index.html` is at the root, not inside another nested folder.
3. In the repository, open **Settings → Pages**.
4. Under the build/deployment source, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for GitHub Pages to publish and open the URL shown in the Pages settings.

After publishing, test the site on your tablet and another device. Do not publish private information, school-only details, or API keys. A public portfolio should contain only information you are comfortable sharing.


## Email contact options
The contact section includes Email me (`mailto:`), Open Gmail (Gmail compose page), and Copy email (clipboard fallback). If a device has no mail app configured, visitors can use Gmail or copy the address.
