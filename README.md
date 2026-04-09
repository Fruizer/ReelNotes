# ReelNotes

ReelNotes is a modern, AI-powered study dashboard designed to turn static class notes into dynamic, short-form "Reel-style" video lectures. Built with a sleek dark-mode UI, it allows students to organize text and picture notes, extract text from handwritten whiteboards using AI Vision, and automatically generate spoken-word tutor sessions with kinetic typography.

## Features

*   **AI Tutor Reel Mode:** Select your notes and hit "Start Reel." The app uses **Gemini 2.5 Flash-Lite** to instantly rewrite your notes into a punchy, energetic tutor script, and reads it out loud using the Web Speech API with perfectly synced, TikTok-style kinetic text animations.
*   **Vision OCR Extraction:** Took a picture of a messy whiteboard? Open the image, click Extract Text, and **Gemini 2.5 Flash** will read the handwriting (including math and physics equations) and convert it directly into formatted Text Notes.
*   **Smart Selection Engine:** A custom-built UI that allows you to seamlessly multi-select notes for batch deletion, editing, or feeding specifically chosen contexts to the AI Tutor.
*   **Auto-Compressing Picture Notes:** Bypasses browser LocalStorage limits by utilizing an invisible HTML5 Canvas engine to dynamically resize and compress images upon upload.
*   **Custom Dark Mode UI:** Zero ugly browser alerts. Features custom-built modals, collapsible accordion lists, and a responsive Bento-box dashboard grid.

## Tech Stack

*   **Frontend:** Pure Vanilla HTML5, CSS3, and JavaScript (ES6+).
*   **AI Engine:** Google Gemini API (`gemini-2.5-flash` for Vision, `gemini-2.5-flash-lite` for text-generation).
*   **Storage:** Window `localStorage` (Cloud database migration coming soon).
*   **APIs:** Web Speech API (Text-to-Speech).


## Usage Guide

1. **Dashboard:** Create a subject (e.g., "Data Structures"). Pin your most important subjects to the top using the pin icon.
2. **Text Notes:** Type your notes, or paste them in. Use "Select Notes" to choose which ones you want to turn into a Reel.
3. **Picture Notes:** Upload photos of your lectures. Click on a photo to open the smooth scroll-to-zoom modal.
4. **Extract Text:** Inside the photo modal, click the purple Extract button to let the AI transcribe the image into your Text Notes.

## Roadmap / Next Steps

- [ ] Migrate from LocalStorage to **Supabase** for persistent cloud storage and cross-device syncing.
- [ ] Add User Authentication (Google Login).
- [ ] Implement Markdown rendering for mathematical formulas and code blocks.
