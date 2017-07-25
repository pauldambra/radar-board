
window.notes = window.notes || {};

window.notes.currentlyVisible = [];

const drawNote = (context, note) => {
  context.fillStyle = 'yellow';
  context.fillRect(note.x, note.y, 75, 75);
};

window.notes.drawAll = context => {
  window.notes.currentlyVisible.forEach(n => drawNote(context, n));
};

window.notes.add = (context, x, y) => { 
  const note = {x, y, dragging: false};
  window.notes.currentlyVisible.push(note);
  drawNote(context, note);
}