const rx = require('rxjs')
const notes = require('./notes.js')

const mouseCoordInsideNote = (note, mouseDown) => {
  const coordWithinWidth = note.x <= mouseDown.x && mouseDown.x <= (note.x + 75)
  const coordWithinHeight = note.y <= mouseDown.y && mouseDown.y <= (note.y + 75)
  return coordWithinWidth && coordWithinHeight
}

const firstDraggableUnderMouse = mouseDown => {
  const note = notes.currentlyVisible.find(n => mouseCoordInsideNote(n, mouseDown))

  if (!note) { return null }
  return {
    note: note,
    startPosition: {
      x: mouseDown.x - note.x,
      y: mouseDown.y - note.y
    }
  }
}

const withOffset = (position, mouseDown) => ({
  note: mouseDown.note,
  x: position.clientX - mouseDown.startPosition.x,
  y: position.clientY - mouseDown.startPosition.y
})

const init = (canvas, draw) => {
  const mouseUps = rx.Observable.fromEvent(canvas, 'mouseup')
  const mouseMoves = rx.Observable.fromEvent(canvas, 'mousemove')

  const mouseDowns = rx.Observable
    .fromEvent(canvas, 'mousedown')
    .map(ev => ({x: ev.offsetX, y: ev.offsetY}))
    .map(firstDraggableUnderMouse)
    .filter(n => !!n)

  const mouseDrag = mouseDowns.flatMap(mouseDown => {
    return mouseMoves.map(move => withOffset(move, mouseDown))
                     .takeUntil(mouseUps)
  })

  mouseDrag.subscribe(
    pos => {
      pos.note.x = pos.x
      pos.note.y = pos.y
      pos.note.dragging = true
    })

  mouseDrag
    .observeOn(rx.Scheduler.animationFrame)
    .subscribe(draw)

  mouseUps
    .subscribe(mu => {
      notes.currentlyVisible.filter(n => n.dragging)
           .forEach(n => { n.dragging = false })
    })

  mouseUps.observeOn(rx.Scheduler.animationFrame).subscribe(draw)
}

module.exports = {
  init
}
