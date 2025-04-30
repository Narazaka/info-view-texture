export type TextProps = {
  text: string;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: "bold" | "normal";
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  lineHeight: number;
  charWrap: boolean;
};
