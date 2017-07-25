
const canvas = document.getElementById('the-canvas');
const context = canvas.getContext('2d');
const magicHeightModifier = 43;

window.onload = () => {
  window.radarCanvas.fitToBody(canvas, document.body, magicHeightModifier);
  window.dragger.init(canvas, draw);
  draw();
  window.notes.registerAddNoteButtonFromDom(document.querySelector('.note-controls .add-note'), context);
}

const draw = () => {
  window.radarCanvas.update(canvas, context);
  window.notes.drawAll(context);
};