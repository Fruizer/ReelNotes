# ReelNotes (v2.0)

Traditional note-taking apps are boring. ReelNotes is an evolving study system designed to defeat short attention spans by turning static notes into high-retention, AI-generated short-form content.

## 🌟 What's New in v2.0 (The UI Update)
The entire application has been rewritten to ditch standard browser alerts and light-mode defaults, replacing them with a sleek, tactical interface.

* **"UI:** A dark-mode aesthetic featuring deep navy (`#0F172A`) backgrounds, electric blue accents, and a modern "Bento Grid" layout for subject cards.
* **Custom Modals:** Ripped out the clunky browser `prompt()` alerts. Adding subjects is now handled through a clean, custom-built dimming overlay.
* **Select / Edit Mode:** Added a "Select Mode" to manage the dashboard. Users can now click multiple bento cards to bulk-delete subjects instead of deleting them one by one.
* **Top Navbar & Branding:** Added a persistent top navigation bar framing the app with a clean profile layout.
* **AI Model Bump:** Upgraded the AI Tutor engine to use `gemini-2.5-flash-lite` for faster, punchier script generation.

## Version History

### v1.2 — The "Talking" Update
* **Video Canvas Overlay:** Implemented a fixed-position cinema container with vertical video support.
* **Dynamic Word-Pop Sync:** Integrated Web Speech API with the `onboundary` event to make text "pop" on screen in perfect sync with the AI's voice, mimicking the TikTok/Reels aesthetic.

### v1.0 — The Prototype
* **Class & Note Management:** Basic CRUD functionality for subjects and notes.
* **Picture Notes:** Support for image uploads with a zoomable focus modal.
* **Local Persistence:** Uses `localStorage` to keep data saved between sessions.

---

## The Roadmap
My goals for the next iterations:

- [x] **TikTok Aesthetic** – Apply high-impact CSS text-shadows and "Pop" animations.
- [x] **AI Integration** – Connect an LLM to automatically format learning scripts.
- [x] **UI Overhaul** – Build a modern, dark-mode bento grid dashboard.
- [ ] **Custom Subject Covers** – Allow users to upload photos or select hex colors for their subject cards.
- [ ] **Photo Text Extractor** – Add OCR to instantly extract text from photos of whiteboards/textbooks and feed it into the Reel.
- [ ] **Database Migration** – Move data from browser `localStorage` to a cloud backend like Supabase.