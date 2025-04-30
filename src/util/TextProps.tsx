export type TextProps = {
  text: string;
  textColor: string;
  outlineColor: string;
  outlineWidth: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: "bold" | "normal";
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  lineHeight: number;
  charWrap: boolean;
};
