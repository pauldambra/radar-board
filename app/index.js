const radarCanvas = require('./the-canvas');
const dragger = require('./rx-dragger');
const notes = require('./notes');

const canvas = document.getElementById('the-canvas');
const context = canvas.getContext('2d');
const magicHeightModifier = 43;

const draw = () => {
  radarCanvas.update(canvas, context);
  notes.drawAll(context);
};

window.onload = () => {
  radarCanvas.fitToBody(canvas, document.body, magicHeightModifier);
  dragger.init(canvas, draw);
  draw();

  const addNoteButton = document.querySelector('.note-controls .add-note');
  notes.registerAddNoteButtonFromDom(addNoteButton, context);
}