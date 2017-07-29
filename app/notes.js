const rx = require('rxjs');

const currentlyVisible = [];

const add = args => { 
  const note = {
    x: args.top, 
    y: args.left, 
    title: args.title, 
    dragging: false
  };
  currentlyVisible.push(note);
  drawNote(args.context, note);
}

const paint = {
    font : '12px Arial',
    fontHeight: 12,
    lineSpace: 2,
    fillColour : 'yellow',
    textColour: '#000',
    textPadding: 10,
    desiredNoteWidth: 150,
    maxNoteHeight: 150
}

const fitsInWidth = (ctx, word, width) => ctx.measureText(word).width < width;

const splitTextToMaxWidth = (text, context, textMaxWidth) => {
  const words = text.split(' ');
  return words.reduce((lines, word) => {
    const candidateLine = `${lines[lines.length-1]} ${word}`;
    if (fitsInWidth(context, candidateLine, textMaxWidth)) {
      lines[lines.length-1] = candidateLine;
    } else {
      lines.push(word);
    }
    return lines;
  }, [""]);
};

const wrapLines = (context, text) => {
  const textMaxWidth = paint.desiredNoteWidth - paint.textPadding;
  context.font = paint.font;

  return splitTextToMaxWidth(text, context, textMaxWidth)
  .map(line => line.trim())
  .map(line => ({text: line}));
};

const drawRectangle = (context, note) => {
  const rectangleHeight = note.textHeight + (paint.textPadding * 2);
  context.fillStyle = paint.fillColour;
  context.fillRect(note.x, note.y, paint.desiredNoteWidth, rectangleHeight);
}

const drawTitle = (context, note) => {
  context.fillStyle = paint.textColour;
  context.font = paint.font;
  context.textBaseline = "middle";

  note.wrappedLines.forEach((line, index) => {
    const lineY = (note.y + paint.textPadding) + line.yOffset;
    const lineX = note.x + line.margin;
    context.fillText(line.text, lineX, lineY);
  });
}

const addYOffsetToLine = (line, index) => {
  line.yOffset = (paint.fontHeight + paint.lineSpace) * index
  return line;
}

const prepareToAddMarginToLines = (context) => (line, index) => {
  const lineWidth = context.measureText(line.text).width;
  line.margin = (paint.desiredNoteWidth - lineWidth) / 2;
  return line;
}

const updateNoteWithWrappedTitleText = (context, note) => {
  const addMarginToLine = prepareToAddMarginToLines(context);

  note.wrappedLines = wrapLines(context, note.title)
    .map(addYOffsetToLine)
    .map(addMarginToLine);

  note.textHeight = note.wrappedLines.length * (paint.fontHeight + paint.lineSpace) + (paint.textPadding * 2);
};

const reportTitleIsTooTall = note => {
  const errorParams = {
    wrappedLines: note.wrappedLines, 
    textHeight: note.textHeight, 
    maxHeight: paint.maxNoteHeight
  };
  const message = `wanted max height of ${paint.maxNoteHeight} but wrapped text height is ${note.textHeight}`;
  console.error(errorParams, message);
}

const drawNote = (context, note) => {   
  if (!note.wrappedLines) {
    updateNoteWithWrappedTitleText(context, note);
  }

  if (note.textHeight > paint.maxNoteHeight) {
    //what _should_ we TODO?
    reportTitleIsTooTall(note);
  }

  drawRectangle(context, note);
  drawTitle(context, note);
};

const drawAll = context => {
  currentlyVisible.forEach(n => drawNote(context, n));
};

module.exports = {
  currentlyVisible,
  drawAll,
  drawNote,
  add
};