
window.dragger = window.dragger || {};

const notes = [];

const mouseCoordInsideNote = (note, mouseDown) => {
  const mouseDownWithinWidth = note.x <= mouseDown.x && mouseDown.x <= (note.x + 75);
  const mouseDownWithinHeight = note.y <= mouseDown.y && mouseDown.y <= (note.y + 75);
  return mouseDownWithinWidth && mouseDownWithinHeight;
};

const firstDraggableUnderMouse = mouseDown => {
  const note = notes.find(n => mouseCoordInsideNote(n, mouseDown));

  if (!note) {return null;}
  return {
      note: note, 
      startPosition: {
        x: mouseDown.x - note.x,
        y: mouseDown.y - note.y,
      }
    };
};

const withOffset = (position, mouseDown) => ({
  note: mouseDown.note,
  x: position.clientX - mouseDown.startPosition.x, 
  y: position.clientY - mouseDown.startPosition.y
});

window.dragger.init = (canvas, draw) => {
  const mouseUps = window.Rx.Observable.fromEvent(canvas, 'mouseup');
  const mouseMoves = window.Rx.Observable.fromEvent(canvas, 'mousemove');

  const mouseDowns = window.Rx.Observable
    .fromEvent(canvas, 'mousedown')
    .map(ev => ({x: ev.offsetX, y: ev.offsetY}))
    .map(firstDraggableUnderMouse)
    .filter(n => !!n);

  const mouseDrag = mouseDowns.flatMap(mouseDown => {
    return mouseMoves.map(move => withOffset(move, mouseDown))
                     .takeUntil(mouseUps);
  });

  mouseDrag.subscribe (
    pos => {
      pos.note.x = pos.x;
      pos.note.y = pos.y;
      pos.note.dragging = true;
    });

  mouseDrag
    .observeOn(Rx.Scheduler.animationFrame)
    .subscribe(draw);

  mouseUps
    .subscribe(mu => {
      notes.filter(n => n.dragging)
           .forEach(n => n.dragging = false);
      });

  mouseUps.observeOn(Rx.Scheduler.animationFrame).subscribe(draw);
};

const drawNote = (context, note) => {
  context.fillStyle = 'yellow';
  context.fillRect(note.x, note.y, 75, 75);
};

window.dragger.addNote = (context, x, y) => { 
  const note = {x, y, dragging: false};
  notes.push(note);
  drawNote(context, note);
}

window.dragger.drawNotes = context => {
  notes.forEach(n => drawNote(context, n));
};

window.dragger.debug = () => {
  notes.forEach(console.log);
}