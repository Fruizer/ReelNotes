# ReelNotes (v1.2)

Traditional note-taking apps are boring. Reel Notes is an evolving class and note management system designed to defeat short attention spans by turning your study material into high-retention short-form content.

## Version History

### v1.2 — The "Talking" Update (Current)
* **Video Canvas Overlay:** Implemented a fixed-position cinema container with vertical video support.
* **Web Speech Integration:** Integrated the browser's native `window.speechSynthesis` to read saved notes out loud.
* **Auto-Scripting:** The app now automatically aggregates all text notes from a specific class into a single "Yapping" script for the Reel.

### v1.0 — The Prototype
* **Class & Note Management:** Basic CRUD (Create, Read, Update, Delete) for subjects and notes.
* **Picture Notes:** Support for image uploads with a zoomable focus modal.
* **Local Persistence:** Uses `localStorage` to keep data saved between sessions.

---

## The Roadmap
My goals for this project:

- [ ] **Text-Syncing Logic** – Split the long note strings into 3-4 word "chunks" that pop up on the screen in sync with the audio.
- [ ] **TikTok Aesthetic** – Apply high-impact CSS text-shadows and "Pop" animations to the overlay.
- [ ] **Framework Migration** – Move the vanilla code into an Astro project for better performance and organization.
- [ ] **Supabase Integration** – Move data from the browser to the cloud.

---
