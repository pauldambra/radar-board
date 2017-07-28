const rx = require('rxjs');

const currentlyVisible = [];

const add = args => { 
  const note = {
    x: args.top, 
    y: args.left, 
    title: args.title, 
    dragging: false
  };
  currentlyVisible.push(note);
  drawNote(args.context, note);
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
  drawAll,
  drawNote,
  add
};