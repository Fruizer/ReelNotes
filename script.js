// --- 1. SUPABASE CONFIG ---
var SUPABASE_URL = 'https://igghnjkzpvaktxxdhzqm.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZ2huamt6cHZha3R4eGRoenFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MDg4NjksImV4cCI6MjA5MTI4NDg2OX0.g1J5J5Sg5-11myOxSji8UP5xJqK2oY8tpT87mChaKhw'; 
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- AUTHENTICATION LOGIC ---
var authContainer = document.getElementById("auth-container");
var authEmailInput = document.getElementById("auth-email");
var authPasswordInput = document.getElementById("auth-password");
var authUsernameInput = document.getElementById("auth-username");
var authSubmitBtn = document.getElementById("auth-submit-btn");
var authToggleBtn = document.getElementById("auth-toggle-btn");
var authError = document.getElementById("auth-error");
var authTitle = document.getElementById("auth-title");
var authSubtitle = document.getElementById("auth-subtitle");

var topNavbar = document.getElementById("top-navbar");
var userProfileBtn = document.getElementById("user-profile-btn");
var userDropdown = document.getElementById("user-dropdown");
var navUsername = document.getElementById("nav-username");
var dropdownName = document.getElementById("dropdown-name");
var dropdownEmail = document.getElementById("dropdown-email");
var logoutBtn = document.getElementById("logout-btn");
var emailConfirmModal = document.getElementById("email-confirm-modal");
var closeEmailModal = document.getElementById("close-email-modal");

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
const textNoteTitleInput = document.getElementById("text-note-title");
const textNotesList = document.getElementById("text-notes-list");
const textNoteInput = document.getElementById("text-note-input");

let currentUser = null;
let isSignUpMode = false; // Tracks which screen we are on

function showAuthError(msg) {
    authError.style.display = "block";
    authError.innerText = msg;
}

// TOGGLE BETWEEN LOGIN AND SIGN UP
authToggleBtn.addEventListener("click", () => {
    isSignUpMode = !isSignUpMode;
    authError.style.display = "none";
    authEmailInput.value = "";
    authPasswordInput.value = "";
    
    if (isSignUpMode) {
        authTitle.innerText = "Create Account";
        authSubtitle.innerText = "Enter your details to get started.";
        authUsernameInput.classList.remove("hidden");
        authSubmitBtn.innerText = "Sign Up";
        authToggleBtn.innerText = "Already have an account? Log In";
    } else {
        authTitle.innerText = "ReelNotes";
        authSubtitle.innerText = "Sign in to sync your notes to the cloud.";
        authUsernameInput.classList.add("hidden");
        authSubmitBtn.innerText = "Log In";
        authToggleBtn.innerText = "Need an account? Sign Up";
    }
});

// MAIN SUBMIT BUTTON (Handles BOTH Login and Signup!)
authSubmitBtn.addEventListener("click", async () => {
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    const username = authUsernameInput.value.trim();
    
    if (!email || !password) return showAuthError("Bro, fill in your email and password!");
    if (isSignUpMode && !username) return showAuthError("Don't forget your username!");
    
    authSubmitBtn.innerText = "Processing...";
    authError.style.display = "none";

    if (isSignUpMode) {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { display_name: username }
            }
        });

        authSubmitBtn.innerText = "Sign Up";

        if (error) {
            showAuthError(error.message);
        } else {
            emailConfirmModal.classList.remove("hidden");
            authToggleBtn.click();
        }

    } else {
        // --- LOG IN LOGIC ---
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        authSubmitBtn.innerText = "Log In";

        if (error) {
            showAuthError(error.message);
        } else {
            checkSession(); // refresh session to load dashboard
        }
    }
});

// Profile Dropdown Toggle Logic
userProfileBtn.addEventListener("click", () => {
    userDropdown.classList.toggle("hidden");
});

// Close dropdown if clicked anywhere else
window.addEventListener("click", (e) => {
    if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add("hidden");
    }
});

// Logout Logic
logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        checkSession(); // This will auto-hide the dashboard and show the login screen
        userDropdown.classList.add("hidden"); // Close the dropdown
    }
});

// Close Email Modal Logic
closeEmailModal.addEventListener("click", () => {
    emailConfirmModal.classList.add("hidden");
});

// Check if user is already logged in
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        authContainer.classList.add("hidden");
        mainMenu.classList.remove("hidden");
        topNavbar.classList.remove("hidden"); // Unhide the top navbar
        
        // Grab the saved username from Supabase metadata (or fallback to email)
        const savedName = currentUser.user_metadata?.display_name || currentUser.email.split('@')[0];
        
        // Update Dashboard Welcome text
        const welcomeSpan = document.getElementById('welcome-username');
        if (welcomeSpan) welcomeSpan.innerText = savedName;

        // Update Top Nav & Dropdown UI with their real data
        if (navUsername) navUsername.innerText = savedName;
        if (dropdownName) dropdownName.innerText = savedName;
        if (dropdownEmail) dropdownEmail.innerText = currentUser.email;
        
    } else {
        currentUser = null;
        authContainer.classList.remove("hidden");
        mainMenu.classList.add("hidden");
        topNavbar.classList.add("hidden"); // Hide the top navbar again
    }
}

// Run this immediately when the page loads
checkSession();

// Data fallback
let subjects = JSON.parse(localStorage.getItem("subjects")) || JSON.parse(localStorage.getItem("classes")) || [];
let textNotes = JSON.parse(localStorage.getItem("textNotes")) || {};
let pictureNotes = JSON.parse(localStorage.getItem("pictureNotes")) || {};
let pinnedSubjects = JSON.parse(localStorage.getItem("pinnedSubjects")) || [];
let isNoteSelectMode = false;
let selectedNoteIndices = new Set();
let currentClass = "";
let selectedNoteIndex = null;

// New Edit Mode State
let isEditMode = false;
let subjectsToDelete = new Set();

// Run immediately
window.onload = () => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    updateSubjectDisplay();
};

// --- DASHBOARD LOGIC ---

function updateSubjectDisplay() {
    classButtonsDiv.innerHTML = "";
    const searchText = classSearchInput.value.toLowerCase();
    
    // SORTING: Pinned subjects go to the top, then alphabetical
    let sortedSubjects = [...subjects].sort((a, b) => {
        const aPinned = pinnedSubjects.includes(a);
        const bPinned = pinnedSubjects.includes(b);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return a.localeCompare(b); 
    });
    
    sortedSubjects
        .filter(s => s.toLowerCase().includes(searchText))
        .forEach((subjectName) => {
            const button = document.createElement("button");
            button.className = "subject-btn"; 
            
            const isPinned = pinnedSubjects.includes(subjectName);
            
            button.innerHTML = `
                ${!isEditMode ? `
                <div class="pin-btn ${isPinned ? 'pinned' : ''}" data-subject="${subjectName}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${isPinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.1 16.3l-5.4-5.4V4.1l1.5-1.5L14.6 0l-1.5 1.5v6.8L7.7 2.9 6.3 4.3l5.4 5.4H4.9l-1.5 1.5L6 14.6l-1.5 1.5h6.8l-5.4 5.4 1.4 1.4 5.4-5.4v6.8l1.5-1.5-2.6-2.6 5.4-5.4z"/>
                    </svg>
                </div>` : ''}
                <div class="card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="card-title">${subjectName}</div>
                <div class="card-footer">Open Workspace &rarr;</div>
            `;
            
            if (isEditMode) {
                button.classList.add("edit-mode-active");
                if (subjectsToDelete.has(subjectName)) button.classList.add("selected-for-delete");
            }

            button.addEventListener("click", (e) => {
                // PIN LOGIC
                if (e.target.closest('.pin-btn')) {
                    e.stopPropagation(); // Stops the workspace from opening
                    if (isPinned) {
                        pinnedSubjects = pinnedSubjects.filter(s => s !== subjectName);
                    } else {
                        pinnedSubjects.push(subjectName);
                    }
                    localStorage.setItem("pinnedSubjects", JSON.stringify(pinnedSubjects));
                    updateSubjectDisplay();
                    return;
                }

                if (isEditMode) {
                    if (subjectsToDelete.has(subjectName)) {
                        subjectsToDelete.delete(subjectName);
                        button.classList.remove("selected-for-delete");
                    } else {
                        subjectsToDelete.add(subjectName);
                        button.classList.add("selected-for-delete");
                    }
                    updateDeleteButtonText();
                } else {
                    currentClass = subjectName;
                    mainMenu.classList.add("hidden");
                    workspaceContainer.classList.remove("hidden");
                    document.getElementById("workspace-title").innerText = subjectName;
                    switchWorkspaceView('text');
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

// ---  CONFIRM MODAL LOGIC ---
const confirmModal = document.getElementById("custom-confirm-modal");
const confirmMessage = document.getElementById("confirm-modal-message");
const acceptConfirmBtn = document.getElementById("accept-confirm-btn");
const cancelConfirmBtn = document.getElementById("cancel-confirm-btn");

let confirmCallback = null;

function showCustomConfirm(message, callback) {
    confirmMessage.innerText = message;
    confirmCallback = callback;
    confirmModal.classList.remove("hidden");
}

cancelConfirmBtn.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
    confirmCallback = null; // Clear it out
});

acceptConfirmBtn.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
    if (confirmCallback) confirmCallback();
    confirmCallback = null;
});

// --- EDIT MODE LOGIC  ---
const defaultActions = document.getElementById("default-actions");
const editActions = document.getElementById("edit-actions");
const deleteSelectedBtnDashboard = document.getElementById("delete-selected");

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
    deleteSelectedBtnDashboard.innerText = `Delete Selected (${subjectsToDelete.size})`;
}

document.getElementById("toggle-edit-mode").addEventListener("click", toggleEditMode);
document.getElementById("cancel-edit-mode").addEventListener("click", toggleEditMode);

document.getElementById("delete-selected").addEventListener("click", () => {
    if (subjectsToDelete.size === 0) return;
    
    // NEW CUSTOM MODAL CALL
    showCustomConfirm(`Are you sure you want to delete ${subjectsToDelete.size} subject(s)? This will wipe all their notes.`, () => {
        subjects = subjects.filter(s => !subjectsToDelete.has(s));
        
        subjectsToDelete.forEach(sub => {
            delete textNotes[sub];
            delete pictureNotes[sub];
        });
        
        localStorage.setItem("subjects", JSON.stringify(subjects));
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
        
        toggleEditMode(); // Exit edit mode
    });
});

// --- WORKSPACE NAVIGATION LOGIC ---
function switchWorkspaceView(viewType) {
    navTextNotes.classList.remove("active");
    navPictureNotes.classList.remove("active");
    viewTextNotes.classList.add("hidden");
    viewPictureNotes.classList.add("hidden");
    
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

navTextNotes.addEventListener("click", () => switchWorkspaceView('text'));
navPictureNotes.addEventListener("click", () => switchWorkspaceView('picture'));

document.getElementById("back-to-dashboard").addEventListener("click", () => {
    workspaceContainer.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    currentClass = ""; 
});

// --- TEXT NOTES LOGIC ---

function loadTextNotes() {
    textNotesList.innerHTML = "";
    const searchText = noteSearchInput.value.toLowerCase();
    
    if (isNoteSelectMode) textNotesList.classList.add("select-mode-active");
    else textNotesList.classList.remove("select-mode-active");
    
    if (textNotes[currentClass]) {
        textNotes[currentClass].forEach((noteData, index) => {
            const isObj = typeof noteData === 'object' && noteData !== null;
            const title = isObj ? noteData.title : `Note ${index + 1}`;
            const content = isObj ? noteData.content : noteData;

            if (title.toLowerCase().includes(searchText) || content.toLowerCase().includes(searchText)) {
                const li = document.createElement("li");
                
                const isChecked = selectedNoteIndices.has(index) ? "checked" : "";
                const previewText = content.length > 80 ? content.substring(0, 80) + "..." : content;
                
                li.innerHTML = `
                    <div class="note-header-bar">
                        <input type="checkbox" class="note-checkbox" data-index="${index}" ${isChecked}>
                        <span class="note-title-text">${title}</span>
                        <svg class="note-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div class="note-preview">${previewText}</div>
                    <div class="note-body">${content}</div>
                `;

                li.addEventListener("click", (e) => {
                    if (window.getSelection().toString().length > 0) return;

                    if (isNoteSelectMode) {
                        const checkbox = li.querySelector('.note-checkbox');
                        if (e.target !== checkbox) checkbox.checked = !checkbox.checked; 
                        
                        if (checkbox.checked) selectedNoteIndices.add(index);
                        else selectedNoteIndices.delete(index);
                        
                        updateNoteSelectionUI();
                    } else {
                        li.classList.toggle("expanded");
                    }
                });
                textNotesList.appendChild(li);
            }
        });
    }
}

document.getElementById("save-text-note").addEventListener("click", () => {
    const title = textNoteTitleInput.value.trim() || "Untitled Note";
    const content = textNoteInput.value.trim();
    
    if (content) {
        const noteObj = { title, content };
        
        if (selectedNoteIndex !== null) {
            textNotes[currentClass][selectedNoteIndex] = noteObj;
            selectedNoteIndex = null;
        } else {
            if (!textNotes[currentClass]) textNotes[currentClass] = [];
            textNotes[currentClass].push(noteObj);
        }
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        textNoteTitleInput.value = "";
        textNoteInput.value = "";
        loadTextNotes();
    }
});

noteSearchInput.addEventListener("input", loadTextNotes);

// --- SMART SELECTION ACTION LOGIC ---
const startReelBtn = document.getElementById("start-reel-btn");
const dynamicActionBar = document.getElementById("dynamic-action-bar");
const editSelectedBtn = document.getElementById("edit-selected-note");
const deleteSelectedBtnNotes = document.getElementById("delete-selected-notes");
const toggleSelectBtn = document.getElementById("toggle-select-notes");

toggleSelectBtn.addEventListener("click", () => {
    isNoteSelectMode = !isNoteSelectMode;
    selectedNoteIndices.clear(); 
    
    if (isNoteSelectMode) {
        toggleSelectBtn.innerText = "Cancel Selection";
        toggleSelectBtn.style.color = "#EF4444";
        toggleSelectBtn.style.borderColor = "#EF4444";
    } else {
        toggleSelectBtn.innerText = "Select Notes";
        toggleSelectBtn.style.color = ""; 
        toggleSelectBtn.style.borderColor = "";
    }
    
    updateNoteSelectionUI();
    loadTextNotes(); 
});

function updateNoteSelectionUI() {
    if (selectedNoteIndices.size > 0) {
        startReelBtn.innerText = `▶ START REEL (${selectedNoteIndices.size} Selected)`;
        dynamicActionBar.classList.remove("hidden");
        
        if (selectedNoteIndices.size === 1) editSelectedBtn.classList.remove("hidden");
        else editSelectedBtn.classList.add("hidden");
        
        deleteSelectedBtnNotes.innerText = `Delete (${selectedNoteIndices.size})`;
    } else {
        startReelBtn.innerText = `▶ START REEL`;
        dynamicActionBar.classList.add("hidden");
    }
}

editSelectedBtn.addEventListener("click", () => {
    if (selectedNoteIndices.size === 1) {
        const indexToEdit = Array.from(selectedNoteIndices)[0];
        const noteData = textNotes[currentClass][indexToEdit];
        const isObj = typeof noteData === 'object' && noteData !== null;
        
        textNoteTitleInput.value = isObj ? noteData.title : `Note ${indexToEdit + 1}`;
        textNoteInput.value = isObj ? noteData.content : noteData;
        
        textNotes[currentClass].splice(indexToEdit, 1);
        toggleSelectBtn.click(); 
    }
});

deleteSelectedBtnNotes.addEventListener("click", () => {
    if (selectedNoteIndices.size > 0) {
        showCustomConfirm(`Delete ${selectedNoteIndices.size} selected note(s)?`, () => {
            const indicesToDelete = Array.from(selectedNoteIndices).sort((a, b) => b - a);
            indicesToDelete.forEach(index => textNotes[currentClass].splice(index, 1));
            
            localStorage.setItem("textNotes", JSON.stringify(textNotes));
            toggleSelectBtn.click(); // Exit select mode
        });
    }
});
// Sort Button Logic for Object-based notes
document.getElementById("sort-text-notes").addEventListener("click", () => {
    if (textNotes[currentClass]) {
        textNotes[currentClass].sort((a, b) => {
            
            const titleA = (typeof a === 'object' && a !== null) ? a.title.toLowerCase() : a.toLowerCase();
            const titleB = (typeof b === 'object' && b !== null) ? b.title.toLowerCase() : b.toLowerCase();
            return titleA.localeCompare(titleB);
        });
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
    if (!file) {
        alert("Please select an image first!");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
  
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1200; // Limits max width
            const MAX_HEIGHT = 1200; // Limits max height
            let width = img.width;
            let height = img.height;

            if (width > height && width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            } else if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);

            try {
                if (!pictureNotes[currentClass]) pictureNotes[currentClass] = [];
                pictureNotes[currentClass].push(compressedDataUrl);
                localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
                imageInput.value = "";
                loadPictureNotes();
            } catch (error) {
                console.error("Storage Error:", error);
                alert("Browser Storage is completely full! Time to migrate to Supabase.");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function deletePictureNote(index) {
    showCustomConfirm("Delete this picture note?", () => {
        pictureNotes[currentClass].splice(index, 1);
        localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
        loadPictureNotes();
    });
}

// --- API KEY MANAGER ---
function getApiKey() {
    let key = localStorage.getItem("geminiApiKey");
    if (!key) {
        key = prompt("Please enter your Gemini API Key:");
        if (key) localStorage.setItem("geminiApiKey", key);
    }
    return key;
}

// --- PHOTO MODAL, SCROLL ZOOM & VISION AI ---
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
const extractTextBtn = document.getElementById("extract-text-btn");
let scale = 1;
let currentActiveImageSrc = ""; 

function showPhotoModal(src) {
    modal.style.display = "block";
    modalImg.src = src;
    currentActiveImageSrc = src;
    scale = 1; 
    modalImg.style.transform = `scale(${scale})`;
    
    extractTextBtn.innerText = "Extract Text";
    extractTextBtn.disabled = false;
}

document.getElementsByClassName("close")[0].onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

document.getElementById("zoom-in").onclick = () => { scale += 0.1; modalImg.style.transform = `scale(${scale})`; };
document.getElementById("zoom-out").onclick = () => { if (scale > 0.2) { scale -= 0.1; modalImg.style.transform = `scale(${scale})`; } };

modalImg.addEventListener("wheel", (e) => {
    e.preventDefault(); 
    if (e.deltaY < 0) scale += 0.1; 
    else if (scale > 0.2) scale -= 0.1; 
    modalImg.style.transform = `scale(${scale})`;
}, { passive: false });

// --- CUSTOM TITLE MODAL & GEMINI VISION TEXT EXTRACTION ---
const titleModal = document.getElementById("custom-title-modal");
const titleInput = document.getElementById("extract-title-input");
const confirmTitleBtn = document.getElementById("confirm-title-btn");
const cancelTitleBtn = document.getElementById("cancel-title-btn");

extractTextBtn.addEventListener("click", () => {
    titleInput.value = ""; 
    titleModal.classList.remove("hidden");
    titleInput.focus();
});

cancelTitleBtn.addEventListener("click", () => {
    titleModal.classList.add("hidden");
});

confirmTitleBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim() || "Extracted Whiteboard Note";
    titleModal.classList.add("hidden"); 

    const apiKey = getApiKey();
    if (!apiKey) return; 

    extractTextBtn.innerText = "Reading Image...";
    extractTextBtn.disabled = true;

    try {
        const base64Data = currentActiveImageSrc.split(',')[1];
        const mimeType = currentActiveImageSrc.split(';')[0].split(':')[1] || "image/jpeg";

        const promptText = "Read all the handwritten or printed text in this image. Format it cleanly as text notes. If there are math equations, write them out clearly in plain text format so they can be read aloud by a text-to-speech engine.";
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptText },
                        { inlineData: { mimeType: mimeType, data: base64Data } }
                    ]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const extractedText = data.candidates[0].content.parts[0].text;

        if (!textNotes[currentClass]) textNotes[currentClass] = [];
        textNotes[currentClass].push({ title: title, content: extractedText.trim() });
        localStorage.setItem("textNotes", JSON.stringify(textNotes));
        
        loadTextNotes();
        extractTextBtn.innerText = "Saved to Text Notes!";
        
        setTimeout(() => { 
            modal.style.display = "none"; 
            extractTextBtn.innerText = "Extract Text"; 
            extractTextBtn.disabled = false;
        }, 1500);

    } catch (error) {
        console.error("Vision API Error Details:", error);
        alert(`Extraction failed! Error: ${error.message}`);
        extractTextBtn.innerText = "Extract Text";
        extractTextBtn.disabled = false;
    }
});

// --- REEL MODE & AI TUTOR ---
const reelContainer = document.getElementById('reel-container');
const reelTextOverlay = document.getElementById('reel-text-overlay');
let speechInstance = null;

async function generateTutorScript(rawNotes) {
    const apiKey = getApiKey();
    if (!apiKey) return "Error generating script. No API Key.";

    const prompt = `You are a fun, energetic tutor making a short-form video. Take the following class notes and rewrite them into a punchy, easy-to-understand tutor script. Explain the concepts simply yet infoirmative like you're talking to a friend. Do NOT use emojis, asterisks, hashtags, or formatting. Just output the plain text script for a text-to-speech engine. Here are the notes: ${rawNotes}`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) { 
        console.error("Tutor API Error:", error);
        return "Error generating script. Check console."; 
    }
}

document.getElementById('start-reel-btn').addEventListener('click', async () => {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance('')); 
    reelContainer.classList.remove('hidden');
    
    if (!textNotes[currentClass] || textNotes[currentClass].length === 0) { 
        reelTextOverlay.innerText = "NO NOTES TO READ"; 
        return; 
    }

    let notesToRead = textNotes[currentClass];
    
    if (isNoteSelectMode && selectedNoteIndices.size > 0) {
        notesToRead = Array.from(selectedNoteIndices).map(index => textNotes[currentClass][index]);
    }

    const rawScriptText = notesToRead.map(n => {
        return (typeof n === 'object' && n !== null) ? `${n.title}: ${n.content}` : n;
    }).join("\n\n");

    reelTextOverlay.innerText = "LOADING REEL...";

    try {
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

    } catch (error) {
        console.error("Reel Generation Error:", error);
        reelTextOverlay.innerText = "ERROR GENERATING SCRIPT";
    }
});

document.getElementById('close-reel-btn').addEventListener('click', () => {
    reelContainer.classList.add('hidden');
    window.speechSynthesis.cancel();
});