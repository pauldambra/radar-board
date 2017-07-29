
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

const addYOffsetToLine = (line, index) => {
  line.yOffset = (paint.fontHeight + paint.lineSpace) * index
  return line;
}

const prepareToAddMarginToLines = (context) => (line, index) => {
  const lineWidth = context.measureText(line.text).width;
  line.margin = (paint.desiredNoteWidth - lineWidth) / 2;
  return line;
}

const wrapText = (context, text) => {
  const addMarginToLine = prepareToAddMarginToLines(context);

  const wrappedLines = wrapLines(context, text)
    .map(addYOffsetToLine)
    .map(addMarginToLine);

  const textHeight = wrappedLines.length * (paint.fontHeight + paint.lineSpace) + (paint.textPadding * 2);

  return {
    wrappedLines,
    textHeight
  }
};

module.exports = {
  wrapText
}