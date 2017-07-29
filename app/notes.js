const canvasLines = require('./canvas-lines.js')

const currentlyVisible = []

const add = args => {
  const note = {
    x: args.top,
    y: args.left,
    title: args.title,
    dragging: false
  }
  currentlyVisible.push(note)
  drawNote(args.context, note)
}

const paint = {
  font: '12px Arial',
  fontHeight: 12,
  lineSpace: 2,
  fillColour: 'yellow',
  textColour: '#000',
  textPadding: 10,
  desiredNoteWidth: 150,
  maxNoteHeight: 150
}

const drawRectangle = (context, note) => {
  const rectangleHeight = note.textHeight + (paint.textPadding * 2)
  context.fillStyle = paint.fillColour
  context.fillRect(note.x, note.y, paint.desiredNoteWidth, rectangleHeight)
}

const drawTitle = (context, note) => {
  context.fillStyle = paint.textColour
  context.font = paint.font
  context.textBaseline = 'middle'

  note.wrappedLines.forEach((line, index) => {
    const lineY = (note.y + paint.textPadding) + line.yOffset
    const lineX = note.x + line.margin
    context.fillText(line.text, lineX, lineY)
  })
}

const reportTitleIsTooTall = note => {
  const errorParams = {
    wrappedLines: note.wrappedLines,
    textHeight: note.textHeight,
    maxHeight: paint.maxNoteHeight
  }
  const message = `wanted max height of ${paint.maxNoteHeight} but wrapped text height is ${note.textHeight}`
  console.error(errorParams, message)
}

const drawNote = (context, note) => {
  if (!note.wrappedLines) {
    const wrappedText = canvasLines.wrapText(context, note.title)
    note = Object.assign(note, wrappedText)
  }

  if (note.textHeight > paint.maxNoteHeight) {
    reportTitleIsTooTall(note)
  }

  drawRectangle(context, note)
  drawTitle(context, note)
}

const drawAll = context => {
  currentlyVisible.forEach(n => drawNote(context, n))
}

module.exports = {
  currentlyVisible,
  drawAll,
  drawNote,
  add
}
