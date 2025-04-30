import type { TextProps } from "./TextProps";
import { wrapText } from "./wrapText";

export function drawText({
  ctx,
  y,
  padding,
  props,
}: {
  ctx: CanvasRenderingContext2D;
  y: number;
  padding: number;
  props: TextProps;
}) {
  const contentWidth = ctx.canvas.width - padding * 2;
  ctx.fillStyle = props.textColor;
  ctx.font = `${props.fontWeight} ${props.fontSize}px "${props.fontFamily}"`;
  ctx.textAlign = props.textAlign;
  ctx.textBaseline = props.textBaseline;
  let x = 0;
  switch (props.textAlign) {
    case "left":
      x = padding;
      break;
    case "right":
      x = ctx.canvas.width - padding;
      break;
    case "center":
      x = ctx.canvas.width / 2;
      break;
  }
  return wrapText({
    ctx,
    fillText: ctx.fillText.bind(ctx),
    text: props.text,
    x,
    y,
    maxWidth: contentWidth,
    lineHeight: props.lineHeight * props.fontSize,
    charWrap: props.charWrap,
  });
}
