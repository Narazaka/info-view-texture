import type { TextProps } from "./util/TextProps";

function DrawText({ props }: { props: TextProps }) {
  return (
    <>
      {props.text && (
        <div
          style={{
            fontSize: `${props.fontSize}px`,
            fontFamily: `"${props.fontFamily}"`,
            color: props.textColor,
            textAlign: props.textAlign,
            lineHeight: `${props.lineHeight}em`,
            WebkitTextStrokeWidth: `${props.outlineWidth}px`,
            WebkitTextStrokeColor: props.outlineColor,
            paintOrder: "stroke fill",
            whiteSpace: "pre-wrap",
          }}
        >
          {props.text}
        </div>
      )}
    </>
  );
}

export default DrawText;
