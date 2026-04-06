# ReelNotes (v2.0)

Traditional note-taking apps are boring. Reel Notes is an evolving study system designed to defeat short attention spans by turning static notes into high-retention, AI-generated short-form content.

## Version History

### v2.0 — The AI & Dashboard Update (Current)
* **Single-Page Subject Dashboard:** Ripped out the clunky navigation menus. Subjects now load instantly in a clean, responsive grid layout for zero-friction access.
* **Gemini AI Tutor:** Integrated Google's Gemini 1.5 Flash model. The app now takes your raw, messy notes and dynamically rewrites them into punchy, 30-second "Doomscroll" scripts.
* **Dynamic Word-Pop Sync:** Upgraded the text-to-speech engine using the `onboundary` event. Words now "pop" on the screen in perfect synchronization with the AI's voice, mimicking the TikTok/Reels aesthetic.
* **Security-First Architecture:** Built a secure `localStorage` prompt for the Gemini API key, keeping the repository safe while allowing local development.

### v1.2 — The "Talking" Update
* **Video Canvas Overlay:** Implemented a fixed-position cinema container with vertical video support.
* **Web Speech Integration:** Integrated the browser's native `window.speechSynthesis` to read saved notes out loud.

### v1.0 — The Prototype
* **Class & Note Management:** Basic CRUD functionality for subjects and notes.
* **Picture Notes:** Support for image uploads with a zoomable focus modal.
* **Local Persistence:** Uses `localStorage` to keep data saved between sessions.

---

## The Roadmap
My goals for this project:

- [x] **Text-Syncing Logic** – Split the long note strings into 3-4 word "chunks" that pop up on screen in sync with the audio.
- [x] **TikTok Aesthetic** – Apply high-impact CSS text-shadows and "Pop" animations to the overlay.
- [x] **AI Integration** – Connect an LLM to automatically format the learning scripts.
- [ ] **Framework Migration** – Move the vanilla code into an Astro or Vite project for better performance and organization.
- [ ] **Supabase Integration** – Move data from the browser to the cloud.