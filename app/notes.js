const rx = require('rxjs');
const currentlyVisible = [];

const add = (context, x, y) => { 
  const note = {x, y, dragging: false};
  currentlyVisible.push(note);
  drawNote(context, note);
}

const registerAddNoteButtonFromDom = (element, context) => {
  const addNotes$ = rx.Observable.fromEvent(element, 'click');
  addNotes$.subscribe(clicks => add(context, 0, 0));
}

const drawNote = (context, note) => {
  context.fillStyle = 'yellow';
  context.fillRect(note.x, note.y, 75, 75);
};

const drawAll = context => {
  currentlyVisible.forEach(n => drawNote(context, n));
};


module.exports = {
  currentlyVisible,
  registerAddNoteButtonFromDom,
  drawAll,
  add
};