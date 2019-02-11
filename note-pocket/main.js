const noteList = document.querySelector('#note-list');
const noNotes = document.querySelector('#no-notes');
const noteTitle = document.querySelector('#note-title');
const noteContent = document.querySelector('#note-content');
const noteAdd = document.querySelector('#note-add');

const NOTES_STORE = 'notesStore';

noteAdd.addEventListener('click', () => {
  const note = new Note({title: 'dupa'});

  Notes.saveNote(note);
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

    li.innerText = note.title;
    li.addEventListener('click', () => {
      console.log('note clicked!');
    });

    noteList.appendChild(li);
  });

  noNotes.style.display = 'none';
}

renderNotes();