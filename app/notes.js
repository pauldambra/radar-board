const canvasLines = require('./canvas-lines.js')
const localRepo = new (require('./localRepo.js'))(window.localStorage)
const config = require('./config.js')

/* taken from https://stackoverflow.com/a/8809472/222163 */
const generateUUID = () => {
  var d = new Date().getTime()
  if (!!window &&
      !!window.performance &&
      typeof window.performance.now === 'function') {
    d += window.performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

const add = args => {
  const note = {
    x: args.top,
    y: args.left,
    title: args.title,
    dragging: false,
    id: generateUUID()
  }
  localRepo.upsert(note)
  drawNote(args.context, note)
}

const drawRectangle = (context, note) => {
  const rectangleHeight = note.textHeight + (config.textPadding * 2)
  context.fillStyle = config.fillColour
  context.fillRect(note.x, note.y, config.desiredNoteWidth, rectangleHeight)
}

const drawTitle = (context, note) => {
  context.fillStyle = config.textColour
  context.font = config.font
  context.textBaseline = 'middle'

  note.wrappedLines.forEach((line, index) => {
    const lineY = (note.y + config.textPadding) + line.yOffset
    const lineX = note.x + line.margin
    context.fillText(line.text, lineX, lineY)
  })
}

const reportTitleIsTooTall = note => {
  const errorParams = {
    wrappedLines: note.wrappedLines,
    textHeight: note.textHeight,
    maxHeight: config.maxNoteHeight
  }
  const message = `wanted max height of ${config.maxNoteHeight} but wrapped text height is ${note.textHeight}`
  console.error(errorParams, message)
}

const drawNote = (context, note) => {
  if (!note.wrappedLines) {
    const wrappedText = canvasLines.wrapText(context, note.title)
    note = Object.assign(note, wrappedText)
  }

  if (note.textHeight > config.maxNoteHeight) {
    reportTitleIsTooTall(note)
  }

  drawRectangle(context, note)
  drawTitle(context, note)
}

const drawAll = context => {
  localRepo.forEach(n => drawNote(context, n))
}

module.exports = {
  drawAll,
  drawNote,
  add
}
