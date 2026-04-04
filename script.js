const mainMenu = document.getElementById("main-menu");
const classSelection = document.getElementById("class-selection");
const notesMenu = document.getElementById("notes-menu");
const textNotesMenu = document.getElementById("text-notes-menu");
const pictureNotesMenu = document.getElementById("picture-notes-menu");
const classButtonsDiv = document.getElementById("class-buttons");
const classSearchInput = document.getElementById("class-search");
const noteSearchInput = document.getElementById("note-search");

let classes = JSON.parse(localStorage.getItem("classes")) || [];
let textNotes = JSON.parse(localStorage.getItem("textNotes")) || {};
let pictureNotes = JSON.parse(localStorage.getItem("pictureNotes")) || {};
let currentClass = "";
let selectedNoteIndex = null;

document.getElementById("see-classes").addEventListener("click", function() {
    mainMenu.classList.add("hidden");
    classSelection.classList.remove("hidden");
    updateClassButtons();
});

document.getElementById("back-to-main").addEventListener("click", function() {
    classSelection.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});

document.getElementById("back-to-classes").addEventListener("click", function() {
    notesMenu.classList.add("hidden");
    classSelection.classList.remove("hidden");
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

document.getElementById("create-class").addEventListener("click", function() {
    const className = prompt("Enter the name of the new class:");
    if (className && !classes.includes(className)) {
        classes.push(className);
        localStorage.setItem("classes", JSON.stringify(classes));
        updateClassButtons();
    } else if (classes.includes(className)) {
        alert("Class already exists.");
    }
});

document.getElementById("delete-class").addEventListener("click", function() {
    const className = prompt("Enter the name of the class to delete:");
    if (className && classes.includes(className)) {
        const confirmDelete = confirm(`Are you sure you want to delete the class "${className}"?`);
        if (confirmDelete) {
            classes = classes.filter(c => c !== className);
            delete textNotes[className]; // Remove associated notes
            delete pictureNotes[className]; // Remove associated picture notes
            localStorage.setItem("classes", JSON.stringify(classes));
            localStorage.setItem("textNotes", JSON.stringify(textNotes));
            localStorage.setItem("pictureNotes", JSON.stringify(pictureNotes));
            updateClassButtons();
        }
    } else {
        alert("Class not found.");
    }
});

// Brute Force Search Algorithm for Classes
function updateClassButtons() {
    classButtonsDiv.innerHTML = "";
    const searchText = classSearchInput.value.toLowerCase();
    classes
        .filter(className => className.toLowerCase().includes(searchText))
        .forEach((className, index) => {
            const button = document.createElement("button");
            button.innerText = className;
            button.addEventListener("click", () => {
                currentClass = className;
                classSelection.classList.add("hidden");
                notesMenu.classList.remove("hidden");
                document.getElementById("class-title").innerText = className;
            });
            classButtonsDiv.appendChild(button);
        });
}

classSearchInput.addEventListener("input", updateClassButtons);

const textNotesList = document.getElementById("text-notes-list");
const saveTextNoteBtn = document.getElementById("save-text-note");
const editTextNoteBtn = document.getElementById("edit-text-note");
const deleteTextNoteBtn = document.getElementById("delete-text-note");
const textNoteInput = document.getElementById("text-note-input");
const sortTextNotesBtn = document.getElementById("sort-text-notes");

// Brute Force Search Algorithm for Text Notes
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