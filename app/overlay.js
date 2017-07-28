
const show = (overlayElement) => {
  overlayElement.style.visibility = "visible";
}

const hide = (overlayElement) => {
  overlayElement.style.visibility = "hidden";
}

module.exports = {
  show,
  hide
}