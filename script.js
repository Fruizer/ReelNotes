const mainMenu = document.getElementById("main-menu");
const classSelection = document.getElementById("class-selection");
const notesMenu = document.getElementById("notes-menu");
const textNotesMenu = document.getElementById("text-notes-menu");
const pictureNotesMenu = document.getElementById("picture-notes-menu");
const classButtonsDiv = document.getElementById("class-buttons");
const classSearchInput = document.getElementById("class-search");
const noteSearchInput = document.getElementById("note-search");


let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let textNotes = JSON.parse(localStorage.getItem("textNotes")) || {};
let pictureNotes = JSON.parse(localStorage.getItem("pictureNotes")) || {};
let currentClass = ""; 
let selectedNoteIndex = null;

window.onload = updateSubjectDisplay;

document.getElementById("back-to-classes").addEventListener("click", function() {
    notesMenu.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});

document.getElementById("text-notes").addEventListener("click", function() {
    notesMenu.classList.add("hidden");
    textNotesMenu.classList.remove("hidden");
    loadTextNotes();
    console.log("Text notes menu opened");
});

document.getElementById("picture-notes").addEventListener("click", function() {
    notesMenu.classList.add("hidden");
    pictureNotesMenu.classList.remove("hidden");
    loadPictureNotes();
});

document.getElementById("back-to-notes").addEventListener("click", function() {
    textNotesMenu.classList.add("hidden");
    notesMenu.classList.remove("hidden");
});

document.getElementById("back-to-notes-pictures").addEventListener("click", function() {
    pictureNotesMenu.classList.add("hidden");
    notesMenu.classList.remove("hidden");
});


function updateSubjectDisplay() {
    const displayDiv = document.getElementById("class-buttons");
    displayDiv.innerHTML = "";
    
    const searchText = document.getElementById("class-search").value.toLowerCase();
  
    subjects
        .filter(s => s.toLowerCase().includes(searchText))
        .forEach(subjectName => {
            const btn = document.createElement("button");
            btn.innerText = subjectName;
            btn.className = "subject-btn"; 
            btn.addEventListener("click", () => {
                currentClass = subjectName;
                document.getElementById("main-menu").classList.add("hidden");
                document.getElementById("notes-menu").classList.remove("hidden");
                document.getElementById("class-title").innerText = subjectName;
            });
            displayDiv.appendChild(btn);
        });
}

document.getElementById("class-search").addEventListener("input", updateSubjectDisplay);


document.getElementById("create-class").addEventListener("click", function() {
    const subjectName = prompt("Enter the name of the new subject:");
    if (subjectName && !subjects.includes(subjectName)) {
        subjects.push(subjectName);
        localStorage.setItem("subjects", JSON.stringify(subjects));
        updateSubjectDisplay(); 
    } else if (subjects.includes(subjectName)) {
        alert("Subject already exists.");
    }
});


document.getElementById("delete-class").addEventListener("click", function() {
    const subjectName = prompt("Enter the name of the subject to delete:");
    if (subjectName && subjects.includes(subjectName)) {
        const confirmDelete = confirm(`Are you sure you want to delete the subject "${subjectName}" and all its notes?`);
        if (confirmDelete) {
            subjects = subjects.filter(s => s !== subjectName);
            delete textNotes[subjectName]; 
            delete pictureNotes[subjectName]; 
            localStorage.setItem("subjects", JSON.stringify(subjects));
            localStorage.setItem("textNotes", JSON.stringify(textNotes));
            localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
            updateSubjectDisplay();
        }
    } else {
        alert("Subject not found.");
    }
});

const textNotesList = document.getElementById("text-notes-list");
const saveTextNoteBtn = document.getElementById("save-text-note");
const editTextNoteBtn = document.getElementById("edit-text-note");
const deleteTextNoteBtn = document.getElementById("delete-text-note");
const textNoteInput = document.getElementById("text-note-input");
const sortTextNotesBtn = document.getElementById("sort-text-notes");


function loadTextNotes() {
    textNotesList.innerHTML = "";
    const searchText = noteSearchInput.value.toLowerCase();
    console.log("Search Text:", searchText); 

    if (textNotes[currentClass]) {
        console.log("Text Notes for Current Class:", textNotes[currentClass]);
        
        const filteredNotes = textNotes[currentClass].filter(note => note.toLowerCase().includes(searchText));
        console.log("Filtered Notes:", filteredNotes);

        filteredNotes.forEach((note, index) => {
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
    document.querySelectorAll("#text-notes-list li").forEach((li, i) => {
        li.classList.toggle("selected", i === index);
    });
}

saveTextNoteBtn.addEventListener("click", function() {
    const note = textNoteInput.value.trim();
    if (note) {
        if (selectedNoteIndex !== null) {
            // Edit the existing note
            textNotes[currentClass][selectedNoteIndex] = note;
            selectedNoteIndex = null;
        } else {
            // Add a new note
            if (!textNotes[currentClass]) {
                textNotes[currentClass] = [];
            }
            textNotes[currentClass].push(note);
        }
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        textNoteInput.value = "";
        loadTextNotes();
    }
});

editTextNoteBtn.addEventListener("click", function() {
    if (selectedNoteIndex !== null) {
        textNoteInput.value = textNotes[currentClass][selectedNoteIndex];
    } else {
        alert("Please select a note to edit.");
    }
});

deleteTextNoteBtn.addEventListener("click", function() {
    if (selectedNoteIndex !== null) {
        const confirmDelete = confirm("Are you sure you want to delete this note?");
        if (confirmDelete) {
            textNotes[currentClass].splice(selectedNoteIndex, 1);
            localStorage.setItem("textNotes", JSON.stringify(textNotes));
            loadTextNotes();
            selectedNoteIndex = null;
        }
    } else {
        alert("Please select a note to delete.");
    }
});

sortTextNotesBtn.addEventListener("click", function() {
    if (textNotes[currentClass]) {
        bubbleSort(textNotes[currentClass]);
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        loadTextNotes();
    }
});

function bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

const pictureNotesList = document.getElementById("picture-notes-list");
const saveImageNoteBtn = document.getElementById("save-image-note");
const imageInput = document.getElementById("image-input");

function loadPictureNotes() {
    pictureNotesList.innerHTML = "";
    if (pictureNotes[currentClass]) {
        pictureNotes[currentClass].forEach((imageSrc, index) => {
            const li = document.createElement("li");
            const img = document.createElement("img");
            img.src = imageSrc;
            img.alt = "Picture Note";
            li.appendChild(img);
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.addEventListener("click", () => deletePictureNote(index));
            li.appendChild(deleteBtn);
            pictureNotesList.appendChild(li);
            
            // Add click event to enlarge photo
            img.addEventListener("click", () => showPhotoModal(imageSrc));
        });
    }
}

saveImageNoteBtn.addEventListener("click", function() {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            if (!pictureNotes[currentClass]) {
                pictureNotes[currentClass] = [];
            }
            pictureNotes[currentClass].push(event.target.result);
            localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
            imageInput.value = ""; // Clear the input
            loadPictureNotes();
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select an image to upload.");
    }
});

function deletePictureNote(index) {
    const confirmDelete = confirm("Are you sure you want to delete this picture note?");
    if (confirmDelete) {
        pictureNotes[currentClass].splice(index, 1);
        localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
        loadPictureNotes();
    }
}

// Modal functionality
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const closeModal = document.getElementsByClassName("close")[0];
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");

let scale = 1;

function showPhotoModal(src) {
    modal.style.display = "block";
    modalImg.src = src;
    captionText.innerHTML = "Click the buttons to zoom in and out.";
    scale = 1; 
    modalImg.style.transform = `scale(${scale})`;
}

closeModal.onclick = function() {
    modal.style.display = "none";
}

zoomIn.onclick = function() {
    scale += 0.1;
    modalImg.style.transform = `scale(${scale})`;
}

zoomOut.onclick = function() {
    if (scale > 0.1) {
        scale -= 0.1;
        modalImg.style.transform = `scale(${scale})`;
    }
}

// Close the modal when clicking outside of the image
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// --- DOM ELEMENTS FOR REEL MODE ---
const startReelBtn = document.getElementById('start-reel-btn');
const closeReelBtn = document.getElementById('close-reel-btn');
const reelContainer = document.getElementById('reel-container');
const reelTextOverlay = document.getElementById('reel-text-overlay');

let speechInstance = null;

// --- AI TUTOR LOGIC ---
let GEMINI_API_KEY = localStorage.getItem("geminiApiKey");

if (!GEMINI_API_KEY) {
    GEMINI_API_KEY = prompt("Developer Mode: Please enter your Gemini API Key to enable the AI Tutor:");
    if (GEMINI_API_KEY) {
        localStorage.setItem("geminiApiKey", GEMINI_API_KEY);
    } else {
        alert("AI Tutor disabled. Refresh and enter a key to use this feature.");
    }
}

async function generateTutorScript(rawNotes) {
    const prompt = `You are a fun, energetic tutor making a short-form video. Take the following class notes and rewrite them into a punchy, easy-to-understand tutor script. Explain the concepts simply yet infoirmative like you're talking to a friend. Do NOT use emojis, asterisks, hashtags, or formatting. Just output the plain text script for a text-to-speech engine. Here are the notes: ${rawNotes}`;
    
    try {

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        const data = await response.json();
        
        // Error
        if (!response.ok) {
            console.error("Full Google Error:", data);
            return `API REJECTED: ${data.error.message}`; 
        }

        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error("Network Error:", error);
        return `NETWORK ERROR: Are you offline or is the browser blocking it?`;
    }
}

// --- REEL MODE ---
startReelBtn.addEventListener('click', async function() {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance('')); 

    reelContainer.classList.remove('hidden');
    
    if (!textNotes[currentClass] || textNotes[currentClass].length === 0) {
        reelTextOverlay.innerText = "NO NOTES FOUND";
        return;
    }

    // 1. Grab raw notes and show loading screen
    const rawScriptText = textNotes[currentClass].join(" ");
    reelTextOverlay.innerText = "Loading Reel...";
    reelTextOverlay.style.animation = 'none';

    // 2. Wait for AI to rewrite the notes
    const aiScript = await generateTutorScript(rawScriptText);
    console.log("THE AI WROTE THIS SCRIPT:", aiScript);

    const cleanScript = aiScript.replace(/[\n\r]+/g, ' ').trim();

    // 3. Setup the talking robot with the CLEANED script
    speechInstance = new SpeechSynthesisUtterance(cleanScript);
    speechInstance.rate = 1.3; 
    speechInstance.pitch = 1;

    // 4. Sync the text to pop up on screen
    speechInstance.onboundary = function(event) {
        if (event.name === 'word') {
            const remainingText = cleanScript.substring(event.charIndex);
            const match = remainingText.match(/^[\w'.-]+[!,?.]*/);
            
            if (match) {
                const currentWord = match[0];
                reelTextOverlay.innerText = currentWord.toUpperCase();
                
                reelTextOverlay.style.animation = 'none';
                void reelTextOverlay.offsetWidth; 
                reelTextOverlay.style.animation = 'wordPop 0.15s ease-out forwards';
            }
        }
    };

    speechInstance.onend = function() {
        reelTextOverlay.innerText = "REEL FINISHED";
    };

    // 5. Speak! (Removed the cancel() so it doesn't instantly kill itself)
    window.speechSynthesis.speak(speechInstance);
});

// --- REEL MODE CLOSE  ---
closeReelBtn.addEventListener('click', function() {
    reelContainer.classList.add('hidden');
    window.speechSynthesis.cancel(); // Stop talking when closed
    reelTextOverlay.innerText = "";
});