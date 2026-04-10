# ReelNotes
**Turn your messy study notes into punchy AI-powered "Reels."**

ReelNotes is a full-stack study assistant designed for students who struggle with standard reviewing. It leverages AI to transform static text notes and whiteboard photos into energetic, conversational audio scripts. Helping you study through listening rather than just staring at walls of text.

---

## Live Demo
reel-notes-one.vercel.app

---

## Tech Stack
*   **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
*   **Backend as a Service:** [Supabase](https://supabase.com/) (Auth & PostgreSQL)
*   **AI Engine:** [Google Gemini 2.5 Flash](https://ai.google.dev/) (Vision & Text Generation)
*   **Audio:** Web Speech API (Text-to-Speech)

---

## How It Works

### 1. Cloud-Synced Dashboards
Upon logging in via **Supabase Auth**, users can create "Subjects." These subjects act as containers for two types of data:
*   **Text Notes:** Traditional typed content.
*   **Picture Notes:** Uploaded images (whiteboards, notebooks, etc.).
All data is synced in real-time to a Supabase PostgreSQL database, ensuring your study materials are available on any device.

### 2. Computer Vision Text Extraction
The app uses the **Gemini 2.5 Flash Vision API** to process "Picture Notes." 
*   It converts Base64 image data into a machine-readable format.
*   The AI extracts handwritten or printed text, which is then automatically saved back to the cloud as a searchable text note.

### 3. AI Tutor Script Generation
Once notes are selected, the **Gemini LLM** analyzes the raw data. Instead of just reading the text, it performs a **semantic transformation** turning dry academic notes into a conversational "Tutor Script" that explains the concepts simply.

### 4. Reel Mode (TTS Engine)
The final script is fed into a **Reel Interface**. Using the **Web Speech API**, the app reads the script aloud while visually "popping" the current word on the screen (synced via `onboundary` events), mimicking the fast-paced engagement of a TikTok or Instagram Reel.

---

## Key Challenges Overcome
*   **State Management:** Coordinating local UI states (like pinned subjects) with asynchronous cloud data from Supabase.
*   **Data Handling:** Optimizing the processing of heavy Base64 image strings to ensure the UI remains responsive during uploads.
*   **Prompt Engineering:** Fine-tuning the AI instructions to ensure the generated scripts are educational yet conversational, avoiding robotic summaries.

---

## Roadmap
- [ ] **Mobile App Version:** Rebuilding in React Native for better on-the-go portability.
- [ ] **Flashcard Integration:** Auto-generating Quizlet-style cards from the extracted text.
- [ ] **Custom AI Voices:** Implementing ElevenLabs for even more realistic tutor personalities.

---

## Author
**Lorenzo Gilbert Flores**  
*Computer Science Student specializing in Software Engineering*
