const noteList = document.querySelector('#note-list');
const noNotes = document.querySelector('#no-notes');
const noteTitle = document.querySelector('#note-title');
const noteContent = document.querySelector('#note-content');
const noteAdd = document.querySelector('#note-add');
const noteColors = document.querySelector('#note-colors');
const noteColor = document.querySelector('#note-color');

const NOTES_STORE = 'notesStore';

const COLORS = [
  '#FFA500',
  '#FFEB3B',
  '#F44336'
];

noteAdd.addEventListener('click', () => {
  const note = new Note({ 
    title: noteTitle.value,
    content: noteContent.value,
    color: noteColor.value
  });

  Notes.saveNote(note);

  noteTitle.value = null;
  noteContent.value = null;
  noteColor.value = null;

  [...noteColors.children].forEach((noteColor) => {
    noteColor.classList.remove('color');
  });
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
  static saveNote(newNote) {
    const notes = Notes.getNotes();
    notes.push(newNote);

    localStorage.setItem(NOTES_STORE, JSON.stringify(notes));
    renderNotes();
  }

  static getNotes() {
    return JSON.parse(localStorage.getItem(NOTES_STORE)) || [];
  }
}


function renderNotes() {
  const notes = Notes.getNotes();

  if (notes.length === 0) {
    return noNotes.style.display = 'block';
  }
  noteList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    const title = document.createElement('span');
    const content = document.createElement('span');
    const pinned = document.createElement('span');
    const remove = document.createElement('span');

    title.classList.add('note-title');
    content.classList.add('note-content');
    pinned.classList.add('note-pinned');
    remove.classList.add('note-remove');

    title.innerText = note.title;
    content.innerText = note.content || null;

    li.style.borderLeft = `2px solid ${note.color}`;

    li.appendChild(title);
    li.appendChild(remove);
    li.appendChild(content);

    li.addEventListener('click', () => {
      console.log('note clicked!');
    });

    noteList.appendChild(li);
  });

  noNotes.style.display = 'none';
}

function renderColors() {
  COLORS.forEach(color => {
    const colorButton = document.createElement('span');

    colorButton.classList.add('note-color-button');
    colorButton.style.background = color;

    colorButton.addEventListener('click', (event) => {
      noteColor.value = color;

      [...noteColors.children].forEach((noteColor) => {
        noteColor.classList.remove('color');
      });

      event.target.classList.add('color');
    });

    noteColors.appendChild(colorButton);
  });
}

renderNotes();
renderColors();