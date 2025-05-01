import type { TextProps } from "./TextProps";

function drawOutline(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  thickness: number,
  draw: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
  ) => void,
) {
  const step = 1;
  const count = 360 / step;
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < count; i += step) {
    draw(
      ctx,
      x + (Math.sin(i) * thickness) / 2,
      y + (Math.cos(i) * thickness) / 2,
      color,
    );
  }
  ctx.globalAlpha = 1;
}

function setTextPropContexts(
  ctx: CanvasRenderingContext2D,
  textProps: TextProps,
) {
  ctx.font = `${textProps.fontWeight} ${textProps.fontSize}px "${textProps.fontFamily}"`;
  ctx.fillStyle = textProps.textColor;
  ctx.textAlign = textProps.textAlign;
  ctx.textBaseline = textProps.textBaseline;
}

function genDrawText(textProps: TextProps) {
  const font = `${textProps.fontWeight} ${textProps.fontSize}px "${textProps.fontFamily}"`;
  return (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
  ) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = textProps.textAlign;
    ctx.textBaseline = textProps.textBaseline;
    ctx.fillText(textProps.text, x, y);
  };
}

function drawTextOutlined(
  ctx: CanvasRenderingContext2D,
  textProps: TextProps,
  x: number,
  y: number,
) {
  if (textProps.outlineWidth === 0) {
    const draw = genDrawText(textProps);
    draw(ctx, x, y, textProps.textColor);
  } else if (textProps.outlineType === "thick") {
    drawTextThickOutlined(ctx, textProps, x, y);
  } else {
    drawTextBlurOutlined(ctx, textProps, x, y);
  }
}

function drawTextThickOutlined(
  ctx: CanvasRenderingContext2D,
  textProps: TextProps,
  x: number,
  y: number,
) {
  const draw = genDrawText(textProps);
  drawOutline(ctx, x, y, textProps.outlineColor, textProps.outlineWidth, draw);
  draw(ctx, x, y, textProps.textColor);
}

function drawTextBlurOutlined(
  ctx: CanvasRenderingContext2D,
  textProps: TextProps,
  x: number,
  y: number,
) {
  const draw = genDrawText(textProps);
  ctx.shadowColor = textProps.outlineColor;
  ctx.shadowBlur = textProps.outlineWidth;
  draw(ctx, x, y, textProps.textColor);
  ctx.shadowBlur = 0;
}

function drawBorderedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  borderWidth: number,
  fillColor: string,
  borderColor: string,
) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(
    x + borderWidth,
    y + borderWidth,
    width - borderWidth * 2,
    height - borderWidth * 2,
  );
  if (borderWidth === 0) return;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(
    x + borderWidth / 2,
    y + borderWidth / 2,
    width - borderWidth,
    height - borderWidth,
  );
}

function drawText({
  ctx,
  y,
  paddingX,
  props,
}: {
  ctx: CanvasRenderingContext2D;
  y: number;
  paddingX: number;
  props: TextProps;
}) {
  const contentWidth = ctx.canvas.width - paddingX * 2;
  let x = 0;
  switch (props.textAlign) {
    case "left":
      x = paddingX;
      break;
    case "right":
      x = ctx.canvas.width - paddingX;
      break;
    case "center":
      x = ctx.canvas.width / 2;
      break;
  }
  ctx.scale(props.scaleX, 1);
  setTextPropContexts(ctx, props);
  const resultY = wrapText({
    ctx,
    fillText: (text, x, y) => {
      drawTextOutlined(ctx, { ...props, text }, x, y);
    },
    text: props.text,
    x: x / props.scaleX,
    y,
    maxWidth: contentWidth / props.scaleX,
    lineHeight: props.lineHeight * props.fontSize,
    charWrap: props.charWrap,
  });
  ctx.scale(1 / props.scaleX, 1);
  return resultY;
}

function wrapText({
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
        console.log("line", line, "LF");
        line = "";
        height += lineHeight;
        continue;
      }
      const testLine = line + text[i];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && line.length > 0) {
        fillText(line, x, y + height);
        console.log("line", line, testWidth);
        line = text[i];
        height += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      fillText(line, x, y + height);
      console.log("line", line, "END");
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

export function draw({
  ctx,
  borderWidth,
  borderColor,
  bgColor,
  paddingX,
  paddingY,
  title,
  quote,
  description,
}: {
  ctx: CanvasRenderingContext2D;
  borderWidth: number;
  borderColor: string;
  bgColor: string;
  paddingX: number;
  paddingY: number;
  title: TextProps;
  quote: TextProps;
  description: TextProps;
}) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.clearRect(0, 0, width, height);
  drawBorderedRect(ctx, 0, 0, width, height, borderWidth, bgColor, borderColor);

  let y = borderWidth + paddingY;
  y += drawText({ ctx, y, paddingX: borderWidth + paddingX, props: title });
  y += drawText({ ctx, y, paddingX: borderWidth + paddingX, props: quote });
  drawText({ ctx, y, paddingX: borderWidth + paddingX, props: description });
}
