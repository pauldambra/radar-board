const rx = require('rxjs');

const radarCanvas = require('./the-canvas');
const dragger = require('./rx-dragger');
const notes = require('./notes');
const overlay = require('./overlay.js');

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

  const overlayElement = document.getElementById('overlay');
  const overlayCloser = document.getElementById('overlay-close');  
  const addNoteButton = document.querySelector('.note-controls [data-add-note]');

  const addNotes$ = rx.Observable.fromEvent(addNoteButton, 'click');
  addNotes$.subscribe(clicks => overlay.show(overlayElement));

  const closeOverlay$ = rx.Observable.fromEvent(overlayCloser, 'click');
  closeOverlay$.subscribe(clicks => overlay.hide(overlayElement));

  const saveNoteButton = document.querySelector('[data-save-note]');
  const saveClicks$ = rx.Observable.fromEvent(saveNoteButton, 'click');
  saveClicks$.subscribe(clicks => notes.add({
    context,
    top: 50,
    left: 50,
    title: document.querySelector('[data-note-name]').value
  }));
}