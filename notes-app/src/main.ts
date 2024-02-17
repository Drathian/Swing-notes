import './style.css'
import { AxiosResponse } from 'axios';
import axios from 'axios';

let API_URL: string = 'https://o6wl0z7avc.execute-api.eu-north-1.amazonaws.com';

const note: any = {
  username: 'ada',
  title: "Första anteckning",
  note: "Min första anteckning"
}

async function getNotes(username) {
  try {
    const response = await axios.get(`${API_URL}/api/notes/:username`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const notes = response.data;

    return notes;
  } catch (error) {
    console.error(error);
  }
}

async function showPrivatePage() {
  const username = localStorage.getItem('username');

  let notes: any[] = await getNotes(username);

  let privatePage = document.querySelector('.private-page');

  if (!privatePage) {
    return;
  }

  if (!notes) {
    privatePage.innerHTML = 'No notes found';
    return;
  } else if (notes.length === 0) {
    privatePage.innerHTML = 'No notes found';
    return;
  }

  privatePage.innerHTML = '';

  for (const note of notes) {
    const noteElement = document.createElement('div');

    noteElement.innerHTML = `
      <p>${note.title}</p>
      <p>${note.note}</p>
    `;

    privatePage.appendChild(noteElement);
  }
}

showPrivatePage();

async function postNote (note: any) {
  console.log(note);
  try {
    const dataToSend: any = note;

    const response: AxiosResponse = await axios.post(
      "https://o6wl0z7avc.execute-api.eu-north-1.amazonaws.com/api/notes",
      dataToSend
    );

    const responseData: JSON = response.data;
    console.log(responseData);
    // Process the response data
  } catch (error) {
    // Handle the error
  }
};

postNote(note);



class Notes {
  notesContainer: HTMLElement | null;
  btnAdd: HTMLElement | null;
  noteId: number | null;
  colourSet: Array<{label:string, value:string}> | null;
  constructor(){
    this.noteId = 0;
    this.colourSet = [
      {'label': 'pale', 'value':'#FEFEFF'},
      {'label': 'blue', 'value':'#eef6fb'},
      {'label': 'beige', 'value':'#FED99B'},
      {'label': 'red', 'value':'#fbd5d0'}
    ];
    this.notesContainer  = document.querySelector('#notes');
    this.btnAdd  = document.querySelector('#btnAdd');
    this.btnAdd.addEventListener('click', this.addNote.bind(this), false);
    this.addNote();
  }
  
  getTimeStamp(){
    let date: Date = new Date();
    let day: number = date.getDate();
    let month: number = date.getMonth() + 1;
    let year: number = date.getFullYear();
    let hour: number = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
    let min: number | string= (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
    let sec: number = date.getSeconds();
    let ampm: string = (date.getHours() >= 12) ? 'pm' : 'am';
    return `${day}/${month}/${year} ${hour}:${min}:${sec} ${ampm}`;
  }

  updateNoteLabel(event: Event){
    let selectedElement: HTMLElement | null = event.target;
    let elements: Array<HTMLElement>= selectedElement.parentNode.getElementsByTagName('a');
    let colour: string | null = selectedElement.getAttribute('data-colour');
    this.setAttribute('style',`background-color:${colour}`);
    for (let element of elements){
      element.classList.toggle('is--active', false);
    }
    selectedElement.classList.add('is--active');
    return false;
  }
  
  deleteNote(event: Event){
    event.target.removeEventListener('click', this.deleteNote);
    let elem: HTMLElement = this;
    if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
    }
    return false;
  }
  
  createNote(){
    this.noteId += 1;
    let container: HTMLElement = document.createElement('div');
    let button: HTMLElement = document.createElement('a');
    let title: HTMLElement = document.createElement('div');
    let header: HTMLElement = document.createElement('header');
    let footer: HTMLElement = document.createElement('footer');
    let body: HTMLElement = document.createElement('div');
    let content: HTMLElement = document.createElement('div');
    let select: HTMLElement = document.createElement('select');
    let id: string = `note${this.noteId}`;
    let _this: any = this;
    
    container.id = id;
    container.classList.add('note__container');
    content.classList.add('note__content');
    body.classList.add('note__body');
    header.classList.add('note__header');
    footer.classList.add('note__footer');
    title.classList.add('note__title');
    button.classList.add('note__delete');
    select.classList.add('note__label');
    
    for (let colour of this.colourSet) {
      let option: HTMLElement = document.createElement('a');
      option.classList.add('note__colour-picker')
      option.setAttribute('data-colour', colour.value);
      option.setAttribute('href', '#colour');
      option.setAttribute('title', colour.label);
      option.setAttribute('style',`background-color: ${colour.value}`);
      option.innerHTML = colour.label;
      option.addEventListener('click', _this.updateNoteLabel.bind(container), false);
      footer.appendChild(option);
    }
    
    let firstOption: HTMLElement = footer.getElementsByTagName('a');
    firstOption[0].classList.add('is--active');
    container.setAttribute('style',`background-color:${firstOption[0].getAttribute('data-colour')}`);
    
    button.setAttribute('data-note', id);
    button.setAttribute('href', '#delete');
    button.innerHTML = '&#45;';
    title.innerHTML = this.getTimeStamp();
    content.setAttribute('contenteditable', 'true')
    button.addEventListener('click', this.deleteNote.bind(container), false);
    
    //Build markup
    body.appendChild(content);
    header.appendChild(title);
    header.appendChild(button);
    container.appendChild(header);
    container.appendChild(body);
    container.appendChild(footer);
    return container;
  }
  
  addNote(event: Event){
    this.notesContainer.insertBefore(this.createNote(), this.notesContainer.childNodes[0]);
  }
  
}

let notes: Notes = new Notes();