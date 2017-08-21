
const rx = require('rxjs')
const notes = require('./notes.js')

const show = (overlayElement) => {
  overlayElement.style.visibility = 'visible'
  document.querySelector('[data-note-name]').focus()
}

const hide = (overlayElement) => {
  overlayElement.style.visibility = 'hidden'
}

const wireUpOverlayClosing = (overlayElement) => {
  const overlayCloser = document.getElementById('overlay-close')
  const closeOverlayClicks$ = rx.Observable.fromEvent(overlayCloser, 'click')
  const closeOverlayOnSave$ = new rx.Subject()
  const shouldCloseOverlay$ = closeOverlayClicks$.merge(closeOverlayOnSave$)
  shouldCloseOverlay$.subscribe(clicks => hide(overlayElement))

  return closeOverlayOnSave$
}

const wireUpAddingNotes = overlayElement => {
  const addNoteButton = document.querySelector('.note-controls [data-add-note]')
  const addNotes$ = rx.Observable.fromEvent(addNoteButton, 'click')
  addNotes$.subscribe(clicks => show(overlayElement))
}

const wireUpTheSaveButton = (context, manuallyCloseOverlay$) => {
  const saveNoteButton = document.querySelector('[data-save-note]')
  const saveClicks$ = rx.Observable.fromEvent(saveNoteButton, 'click')
  saveClicks$.subscribe(clicks => {
    notes.add({
      context,
      top: 50,
      left: 50,
      title: document.querySelector('[data-note-name]').value
    })
    manuallyCloseOverlay$.next()
  })
}

const init = (context) => {
  const overlayElement = document.getElementById('overlay')
  wireUpAddingNotes(overlayElement)

  const manuallyCloseOverlay$ = wireUpOverlayClosing(overlayElement)
  wireUpTheSaveButton(context, manuallyCloseOverlay$)
}

module.exports = {
  init,
  show,
  hide
}
