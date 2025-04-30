import type { TextProps } from "./util/TextProps";

function DrawText({ props, width }: { props: TextProps; width: number }) {
  return (
    <>
      {props.text && (
        <div
          style={{
            width: `${width / props.scaleX}px`,
            fontSize: `${props.fontSize}px`,
            fontFamily: `"${props.fontFamily}"`,
            color: props.textColor,
            textAlign: props.textAlign,
            lineHeight: `${props.lineHeight}em`,
            WebkitTextStrokeWidth: `${props.outlineWidth}px`,
            WebkitTextStrokeColor: props.outlineColor,
            paintOrder: "stroke fill",
            whiteSpace: "pre-wrap",
            transform: `scaleX(${props.scaleX})`,
            transformOrigin: "left top",
          }}
        >
          {props.text}
        </div>
      )}
    </>
  );
}

export default DrawText;
