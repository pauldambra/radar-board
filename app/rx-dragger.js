const rx = require('rxjs')
const localRepo = new (require('./localRepo.js'))(window.localStorage)
const config = require('./config.js')

const mouseCoordInsideNote = (note, mouseDown) => {
  const w = config.desiredNoteWidth
  const coordWithinWidth = note.x <= mouseDown.x && mouseDown.x <= (note.x + w)
  const coordWithinHeight = note.y <= mouseDown.y && mouseDown.y <= (note.y + w)
  return coordWithinWidth && coordWithinHeight
}

const firstDraggableUnderMouse = mouseDown => {
  const note = localRepo.find(n => mouseCoordInsideNote(n, mouseDown))

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

  const updateNote = pos => {
    pos.note.x = pos.x
    pos.note.y = pos.y
    pos.note.dragging = true
  }

  mouseDrag.subscribe(
    pos => {
      updateNote(pos)
      localRepo.upsert(pos.note)
    })

  mouseDrag
    .observeOn(rx.Scheduler.animationFrame)
    .subscribe(draw)

  mouseUps
    .subscribe(mu => {
      localRepo.filter(n => n.dragging)
           .forEach(n => { n.dragging = false })
    })

  mouseUps.observeOn(rx.Scheduler.animationFrame).subscribe(draw)
}

module.exports = {
  init
}
