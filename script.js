// --- INITIALIZATION & DATA MIGRATION ---
const mainMenu = document.getElementById("main-menu");
const workspaceContainer = document.getElementById("workspace-container");
const viewTextNotes = document.getElementById("view-text-notes");
const viewPictureNotes = document.getElementById("view-picture-notes");
const navTextNotes = document.getElementById("nav-text-notes");
const navPictureNotes = document.getElementById("nav-picture-notes");
const classButtonsDiv = document.getElementById("class-buttons");
const classSearchInput = document.getElementById("class-search");
const noteSearchInput = document.getElementById("note-search");

// Data fallback
let subjects = JSON.parse(localStorage.getItem("subjects")) || JSON.parse(localStorage.getItem("classes")) || [];
let textNotes = JSON.parse(localStorage.getItem("textNotes")) || {};
let pictureNotes = JSON.parse(localStorage.getItem("pictureNotes")) || {};
let currentClass = "";
let selectedNoteIndex = null;

// New Edit Mode State
let isEditMode = false;
let subjectsToDelete = new Set();

// Run immediately
window.onload = () => {
    // Save migrated data if needed
    localStorage.setItem("subjects", JSON.stringify(subjects));
    updateSubjectDisplay();
};

// --- DASHBOARD LOGIC ---

function updateSubjectDisplay() {
    classButtonsDiv.innerHTML = "";
    const searchText = classSearchInput.value.toLowerCase();
    
    subjects
        .filter(s => s.toLowerCase().includes(searchText))
        .forEach((subjectName) => {
            const button = document.createElement("button");
            button.className = "subject-btn"; 
            
            button.innerHTML = `
                <div class="card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="card-title">${subjectName}</div>
                <div class="card-footer">Open Workspace &rarr;</div>
            `;
            
            // Check if we are in edit mode
            if (isEditMode) {
                button.classList.add("edit-mode-active");
                if (subjectsToDelete.has(subjectName)) {
                    button.classList.add("selected-for-delete");
                }
            }

            button.addEventListener("click", () => {
                if (isEditMode) {
                    // Toggle selection for deletion
                    if (subjectsToDelete.has(subjectName)) {
                        subjectsToDelete.delete(subjectName);
                        button.classList.remove("selected-for-delete");
                    } else {
                        subjectsToDelete.add(subjectName);
                        button.classList.add("selected-for-delete");
                    }
                    updateDeleteButtonText();
                } else {
                    // Normal mode: Open Workspace
                    currentClass = subjectName;
                    mainMenu.classList.add("hidden");
                    workspaceContainer.classList.remove("hidden");
                    
                    // Update Title and default to Text Notes
                    document.getElementById("workspace-title").innerText = subjectName;
                    switchWorkspaceView('text');
                    loadTextNotes();
                }
            });
            classButtonsDiv.appendChild(button);
        });
}

classSearchInput.addEventListener("input", updateSubjectDisplay);

// --- MODAL LOGIC ---
const addModal = document.getElementById("custom-add-modal");
const newSubjectInput = document.getElementById("new-subject-input");

document.getElementById("show-add-modal").addEventListener("click", () => {
    addModal.classList.remove("hidden");
    newSubjectInput.value = "";
    newSubjectInput.focus();
});

document.getElementById("cancel-add").addEventListener("click", () => {
    addModal.classList.add("hidden");
});

document.getElementById("confirm-add").addEventListener("click", () => {
    const subjectName = newSubjectInput.value.trim();
    if (subjectName && !subjects.includes(subjectName)) {
        subjects.push(subjectName);
        localStorage.setItem("subjects", JSON.stringify(subjects));
        updateSubjectDisplay();
        addModal.classList.add("hidden");
    } else if (subjects.includes(subjectName)) {
        alert("Subject already exists!");
    }
});

// --- EDIT MODE LOGIC  ---
const defaultActions = document.getElementById("default-actions");
const editActions = document.getElementById("edit-actions");
const deleteSelectedBtn = document.getElementById("delete-selected");

function toggleEditMode() {
    isEditMode = !isEditMode;
    subjectsToDelete.clear();
    
    if (isEditMode) {
        defaultActions.classList.add("hidden");
        editActions.classList.remove("hidden");
    } else {
        defaultActions.classList.remove("hidden");
        editActions.classList.add("hidden");
    }
    
    updateDeleteButtonText();
    updateSubjectDisplay();
}

function updateDeleteButtonText() {
    deleteSelectedBtn.innerText = `Delete Selected (${subjectsToDelete.size})`;
}

document.getElementById("toggle-edit-mode").addEventListener("click", toggleEditMode);
document.getElementById("cancel-edit-mode").addEventListener("click", toggleEditMode);

document.getElementById("delete-selected").addEventListener("click", () => {
    if (subjectsToDelete.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${subjectsToDelete.size} subject(s)? This will wipe all their notes.`)) {
        subjects = subjects.filter(s => !subjectsToDelete.has(s));
        
        subjectsToDelete.forEach(sub => {
            delete textNotes[sub];
            delete pictureNotes[sub];
        });
        
        localStorage.setItem("subjects", JSON.stringify(subjects));
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
        
        toggleEditMode(); // Exit edit mode
    }
});

// --- WORKSPACE NAVIGATION LOGIC ---
function switchWorkspaceView(viewType) {
    // Reset buttons
    navTextNotes.classList.remove("active");
    navPictureNotes.classList.remove("active");
    
    // Hide both views
    viewTextNotes.classList.add("hidden");
    viewPictureNotes.classList.add("hidden");
    
    // Show selected
    if (viewType === 'text') {
        navTextNotes.classList.add("active");
        viewTextNotes.classList.remove("hidden");
        loadTextNotes();
    } else {
        navPictureNotes.classList.add("active");
        viewPictureNotes.classList.remove("hidden");
        loadPictureNotes();
    }
}

// Sidebar Button Listeners
navTextNotes.addEventListener("click", () => switchWorkspaceView('text'));
navPictureNotes.addEventListener("click", () => switchWorkspaceView('picture'));

// Back to Dashboard Listener
document.getElementById("back-to-dashboard").addEventListener("click", () => {
    workspaceContainer.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    currentClass = ""; // Clear state
});

// --- TEXT NOTES LOGIC ---
const textNotesList = document.getElementById("text-notes-list");
const textNoteInput = document.getElementById("text-note-input");

function loadTextNotes() {
    textNotesList.innerHTML = "";
    const searchText = noteSearchInput.value.toLowerCase();
    if (textNotes[currentClass]) {
        textNotes[currentClass]
            .filter(note => note.toLowerCase().includes(searchText))
            .forEach((note, index) => {
                const li = document.createElement("li");
                li.innerText = note;
                li.addEventListener("click", () => selectNote(index));
                textNotesList.appendChild(li);
            });
    }
}

noteSearchInput.addEventListener("input", loadTextNotes);

function selectNote(index) {
    selectedNoteIndex = index;
    document.querySelectorAll("#text-notes-list li").forEach((li, i) => li.classList.toggle("selected", i === index));
}

document.getElementById("save-text-note").addEventListener("click", () => {
    const note = textNoteInput.value.trim();
    if (note) {
        if (selectedNoteIndex !== null) {
            textNotes[currentClass][selectedNoteIndex] = note;
            selectedNoteIndex = null;
        } else {
            if (!textNotes[currentClass]) textNotes[currentClass] = [];
            textNotes[currentClass].push(note);
        }
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        textNoteInput.value = "";
        loadTextNotes();
    }
});

document.getElementById("edit-text-note").addEventListener("click", () => {
    if (selectedNoteIndex !== null) textNoteInput.value = textNotes[currentClass][selectedNoteIndex];
    else alert("Select a note to edit.");
});

document.getElementById("delete-text-note").addEventListener("click", () => {
    if (selectedNoteIndex !== null && confirm("Delete note?")) {
        textNotes[currentClass].splice(selectedNoteIndex, 1);
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        loadTextNotes();
        selectedNoteIndex = null;
    }
});

document.getElementById("sort-text-notes").addEventListener("click", () => {
    if (textNotes[currentClass]) {
        textNotes[currentClass].sort();
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        loadTextNotes();
    }
});

// --- PICTURE NOTES LOGIC ---
const pictureNotesList = document.getElementById("picture-notes-list");
const imageInput = document.getElementById("image-input");

function loadPictureNotes() {
    pictureNotesList.innerHTML = "";
    if (pictureNotes[currentClass]) {
        pictureNotes[currentClass].forEach((imageSrc, index) => {
            const li = document.createElement("li");
            const img = document.createElement("img");
            img.src = imageSrc;
            li.appendChild(img);
            
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.className = "btn-ghost-danger";
            deleteBtn.style.marginTop = "5px";
            deleteBtn.addEventListener("click", () => deletePictureNote(index));
            
            li.appendChild(deleteBtn);
            pictureNotesList.appendChild(li);
            img.addEventListener("click", () => showPhotoModal(imageSrc));
        });
    }
}

document.getElementById("save-image-note").addEventListener("click", () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!pictureNotes[currentClass]) pictureNotes[currentClass] = [];
            pictureNotes[currentClass].push(e.target.result);
            localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
            imageInput.value = "";
            loadPictureNotes();
        };
        reader.readAsDataURL(file);
    }
});

function deletePictureNote(index) {
    if (confirm("Delete picture?")) {
        pictureNotes[currentClass].splice(index, 1);
        localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
        loadPictureNotes();
    }
}

// --- PHOTO MODAL ---
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
let scale = 1;

function showPhotoModal(src) {
    modal.style.display = "block";
    modalImg.src = src;
    scale = 1; 
    modalImg.style.transform = `scale(${scale})`;
}

document.getElementsByClassName("close")[0].onclick = () => modal.style.display = "none";
document.getElementById("zoom-in").onclick = () => { scale += 0.1; modalImg.style.transform = `scale(${scale})`; };
document.getElementById("zoom-out").onclick = () => { if (scale > 0.1) { scale -= 0.1; modalImg.style.transform = `scale(${scale})`; } };
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// --- REEL MODE & AI TUTOR  ---
const reelContainer = document.getElementById('reel-container');
const reelTextOverlay = document.getElementById('reel-text-overlay');
let speechInstance = null;

let GEMINI_API_KEY = localStorage.getItem("geminiApiKey");
if (!GEMINI_API_KEY) {
    GEMINI_API_KEY = prompt("Enter Gemini API Key:");
    if (GEMINI_API_KEY) localStorage.setItem("geminiApiKey", GEMINI_API_KEY);
}

async function generateTutorScript(rawNotes) {
    const prompt = `You are a fun, energetic tutor making a short-form video. Take the following class notes and rewrite them into a punchy, easy-to-understand tutor script. Explain the concepts simply yet infoirmative like you're talking to a friend. Do NOT use emojis, asterisks, hashtags, or formatting. Just output the plain text script for a text-to-speech engine. Here are the notes: ${rawNotes}`;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) { return "Error generating script. Check console."; }
}

document.getElementById('start-reel-btn').addEventListener('click', async () => {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance('')); 
    reelContainer.classList.remove('hidden');
    if (!textNotes[currentClass] || textNotes[currentClass].length === 0) { 
        reelTextOverlay.innerText = "NO NOTES TO READ"; 
        return; 
    }

    const rawScriptText = textNotes[currentClass].join(" ");
    reelTextOverlay.innerText = "LOADING REEL...";
    const aiScript = await generateTutorScript(rawScriptText);
    const cleanScript = aiScript.replace(/[\n\r]+/g, ' ').trim();

    speechInstance = new SpeechSynthesisUtterance(cleanScript);
    speechInstance.rate = 1.3;
    speechInstance.onboundary = (event) => {
        if (event.name === 'word') {
            const wordMatch = cleanScript.substring(event.charIndex).match(/^[\w'.-]+/);
            if(wordMatch) {
                reelTextOverlay.innerText = wordMatch[0].toUpperCase();
                reelTextOverlay.style.animation = 'none';
                void reelTextOverlay.offsetWidth; 
                reelTextOverlay.style.animation = 'wordPop 0.15s ease-out forwards';
            }
        }
    };
    speechInstance.onend = () => reelTextOverlay.innerText = "FINISHED";
    window.speechSynthesis.speak(speechInstance);
});

document.getElementById('close-reel-btn').addEventListener('click', () => {
    reelContainer.classList.add('hidden');
    window.speechSynthesis.cancel();
});