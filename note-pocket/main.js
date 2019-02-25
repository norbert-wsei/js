const noteList = document.querySelector('#note-list');
const noNotes = document.querySelector('#no-notes');
const noteTitle = document.querySelector('#note-title');
const noteContent = document.querySelector('#note-content');
const noteAdd = document.querySelector('#note-add');
const noteColors = document.querySelector('#note-colors');
const noteColor = document.querySelector('#note-color');
const addNewNote = document.querySelector('#note-add-new');

const NOTES_STORE = 'notesStore';

const COLORS = [
  '#FFA500',
  '#FFEB3B',
  '#F44336',
  '#CDDC39',
  '#2196F3',
  '#9C27B0'
];

let isEditing = false;
let currentEditNoteIndex = -1;
let currentNoteIsPinned = false;

noteAdd.addEventListener('click', () => {
  if (noteTitle.value === '' || noteContent === '') {
    return;
  }
  
  if (isEditing) {
    return saveEditNote();
  }

  const note = new Note({
    title: noteTitle.value,
    content: noteContent.value,
    color: noteColor.value
  });

  Notes.saveNote(note);

  noteTitle.value = null;
  noteContent.value = null;
  noteColor.value = null;

  disableColorButton();
});

addNewNote.addEventListener('click', () => {
  isEditing = false;

  noteTitle.value = null;
  noteContent.value = null;
  noteColor.value = null;

  noteAdd.innerHTML = 'Dodaj';
});

class Note {
  constructor({ title, content, color, pinned = false }) {
    this.title = title;
    this.content = content;
    this.color = color;
    this.pinned = pinned;
  }
}

class Notes {
  static saveNotes(notes) {
    localStorage.setItem(NOTES_STORE, JSON.stringify(notes));
    renderNotes();
  }

  static saveNote(newNote) {
    const notes = Notes.getNotes();
    notes.push(newNote);

    Notes.saveNotes(notes);
  }

  static getNotes() {
    const notes = JSON.parse(localStorage.getItem(NOTES_STORE));

    return notes && notes.sort(note => note.pinned ? -1 : 1) || [];
  }

  static editNote(index) {
    const notes = Notes.getNotes();

    return notes[index];
  }

  static saveEditNote(index, note) {
    const notes = Notes.getNotes();

    notes[index] = note;

    Notes.saveNotes(notes);
  }

  static removeNote(index) {
    const notes = Notes.getNotes();

    notes.splice(index, 1);

    Notes.saveNotes(notes);
  }

  static setPinnedNote(index) {
    const notes = Notes.getNotes();

    notes[index].pinned = true;

    Notes.saveNotes(notes);
  }
}


function renderNotes() {
  const notes = Notes.getNotes();

  if (notes.length === 0) {
    noteList.innerHTML = '';
    return noNotes.style.display = 'block';
  }

  noteList.innerHTML = '';
  notes
    .forEach((note, index) => {
      const leftBox = document.createElement('div');
      const rightBox = document.createElement('div');

      const li = document.createElement('li');
      const title = document.createElement('span');
      const content = document.createElement('span');
      const pinned = document.createElement('span');
      const remove = document.createElement('span');

      leftBox.classList.add('note-left-box');
      rightBox.classList.add('note-right-box');

      title.classList.add('note-title');
      content.classList.add('note-content');
      pinned.classList.add('note-pinned');
      remove.classList.add('note-remove');

      remove.addEventListener('click', (event) => {
        event.stopPropagation();
        Notes.removeNote(index);
      });

      pinned.addEventListener('click', (event) => {
        event.stopPropagation();
        Notes.setPinnedNote(index);
      });

      title.innerText = note.title;
      content.innerText = note.content || null;

      li.style.borderLeft = `4px solid ${note.color}`;

      li.dataset.index = index;

      if (note.pinned) {
        pinned.classList.add('note-pinned-active');
      }

      leftBox.appendChild(title);
      leftBox.appendChild(content);
      
      rightBox.appendChild(pinned);
      rightBox.appendChild(remove);

      li.appendChild(leftBox);
      li.appendChild(rightBox);

      li.addEventListener('click', editNote);

      noteList.appendChild(li);
    });

  noNotes.style.display = 'none';
}

function renderColors() {
  COLORS.forEach(color => {
    const colorButton = document.createElement('span');

    colorButton.classList.add('note-color-button');
    colorButton.style.background = color;
    colorButton.dataset.color = color;

    colorButton.addEventListener('click', (event) => {
      noteColor.value = color;

      disableColorButton();

      event.target.classList.add('color');
    });

    noteColors.appendChild(colorButton);
  });
}

function editNote() {
  const index = this.dataset.index;

  isEditing = true;
  currentEditNoteIndex = index;
  const note = Notes.editNote(index);

  noteAdd.innerHTML = 'Zapisz';

  noteTitle.value = note.title;
  noteContent.value = note.content;
  noteColor.value = note.color;
  currentNoteIsPinned = note.pinned;

  disableColorButton();

  [...noteColors.children].forEach((noteColor) => {
    if (noteColor.dataset.color === note.color) {
      noteColor.classList.add('color');
    }
  });
}

function saveEditNote() {
  const note = {
    title: noteTitle.value,
    content: noteContent.value,
    color: noteColor.value,
    pinned: currentNoteIsPinned
  }

  Notes.saveEditNote(currentEditNoteIndex, note);
}

function disableColorButton() {
  [...noteColors.children].forEach((noteColor) => {
    noteColor.classList.remove('color');
  });
}

renderNotes();
renderColors();
