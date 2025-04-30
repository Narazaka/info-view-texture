export function wrapText({
  ctx,
  fillText,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  charWrap,
}: {
  ctx: CanvasRenderingContext2D;
  fillText: (text: string, x: number, y: number) => void;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
  charWrap: boolean;
}) {
  let height = 0;
  if (charWrap) {
    let line = "";
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "\n") {
        fillText(line, x, y + height);
        console.log("line", height);
        line = "";
        height += lineHeight;
        continue;
      }
      const testLine = line + text[i];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && line.length > 0) {
        fillText(line, x, y + height);
        console.log("line", height);
        line = text[i];
        height += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      fillText(line, x, y + height);
      console.log("line", height);
      height += lineHeight;
    }
  } else {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      if (words[n] === "\n") {
        fillText(line, x, y + height);
        line = "";
        height += lineHeight;
        continue;
      }
      const testLine = `${line + words[n]} `;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        fillText(line, x, y + height);
        line = `${words[n]} `;
        height += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      fillText(line, x, y + height);
      height += lineHeight;
    }
  }
  return height;
}
