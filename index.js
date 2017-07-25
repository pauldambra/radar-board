
var canvas = document.getElementById('the-canvas');
var context = canvas.getContext('2d');
window.radarCanvas.fitToBody(canvas, document.body);

window.onload = () => {
  window.dragger.init(canvas, draw);
  draw();
  window.notes.add(context, 75, 75);
}

const draw = () => {
  window.radarCanvas.update(canvas, context);
  window.notes.drawAll(context);
};