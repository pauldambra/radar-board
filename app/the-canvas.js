
const d2r = d => (d * Math.PI) / 180

const drawArc = (ctx, r) => ctx.arc(
  centreX,
  centreY,
  r,
  south,
  west,
  drawClockwise)

const min = {
  x: document.body.offsetWidth * 0.05,
  y: document.body.offsetHeight * 0.05
}
const max = {
  x: document.body.offsetWidth * 0.95,
  y: document.body.offsetHeight * 0.95
}

const origin = min
const topRight = {x: max.x, y: min.y}
const bottomRight = max

const centreX = topRight.x
const centreY = topRight.y

const radiusNow = max.y * 0.33
const radiusNext = max.y * 0.66

const south = d2r(90)
const west = d2r(180)

const drawClockwise = false

const createRadar = context => {
  context.font = '24px sanserif'
  context.fillStyle = 'black'
  context.textBaseline = 'alphabetic'

  context.beginPath()

  context.moveTo(origin.x, origin.y)
  context.lineTo(topRight.x, topRight.y)
  context.lineTo(bottomRight.x, bottomRight.y)

  context.fillText('Now', max.x - 120, 25)
  drawArc(context, radiusNow)
  context.moveTo(topRight.x, topRight.y + radiusNow)

  context.fillText('Next', max.x - 380, 25)
  drawArc(context, radiusNext)
  context.moveTo(topRight.x, topRight.y + radiusNext)

  context.fillText('Later', max.x - 610, 25)

  context.fillStyle = 'white'
  context.fill()
  context.strokeStyle = 'black'
  context.lineWidth = 1
  context.stroke()
}

const fitToBody = (canvas, documentBody, heightMargin) => {
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.width = documentBody.offsetWidth
  canvas.height = documentBody.offsetHeight - heightMargin
}

const update = (canvas, context) => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  createRadar(context)
}

module.exports = {
  fitToBody,
  update
}
