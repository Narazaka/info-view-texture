import {
  Autocomplete,
  Button,
  ColorInput,
  Container,
  Grid,
  NumberInput,
  Stack,
  Title,
} from "@mantine/core";
import { useState, useRef, useReducer, useCallback, useEffect } from "react";
import type { TextProps } from "./util/TextProps";
import { TextPropsView } from "./TextPropsView";
import DrawText from "./DrawText";
import html2canvas from "html2canvas";

type ColorPreset = {
  textColor: string;
  outlineColor: string;
  bgColor: string;
  borderColor: string;
  invertQuote: boolean;
};
const colorPresets: ColorPreset[] = [
  {
    textColor: "#fff",
    outlineColor: "#ff00a5",
    bgColor: "#ffa7fb",
    borderColor: "#ff00a5",
    invertQuote: true,
  },
  {
    textColor: "#fff",
    outlineColor: "#000",
    bgColor: "#fff",
    borderColor: "#000",
    invertQuote: false,
  },
];

const defaultTextProps: TextProps = {
  text: "",
  textColor: "#fff",
  outlineColor: "#000",
  outlineWidth: 7,
  fontSize: 40,
  fontFamily: "Arial",
  fontWeight: "normal",
  textAlign: "left",
  textBaseline: "top",
  lineHeight: 1.3,
  charWrap: true,
};
const useTextProps = (initialState: Partial<TextProps> = {}) => {
  const [props, setProps] = useReducer(
    (state, action: Partial<TextProps>) => ({ ...state, ...action }),
    { ...defaultTextProps, ...initialState },
  );
  return [props, setProps] as const;
};

function App() {
  const [title, setTitle] = useTextProps({
    text: "最強無敵生物",
    fontFamily: "GenEi M Gothic v2 Black",
    fontSize: 52,
    textColor: "#fff",
    outlineColor: "#ff00a5",
  });
  const [quote, setQuote] = useTextProps({
    text: "「私は最強無敵生物」",
    fontFamily: "GenEi POPle Black",
    textColor: "#ff00a5",
    outlineColor: "#fff",
  });
  const [description, setDescription] = useTextProps({
    text: "これは説明です\nとてもつよい",
    fontFamily: "GenEi M Gothic v2 Black",
    textColor: "#fff",
    outlineColor: "#ff00a5",
  });
  const [bgColor, setBgColor] = useState("#fff");
  const [borderColor, setBorderColor] = useState("#000");
  const [borderWidth, setBorderWidth] = useState(12);
  const [canvasWidth, setCanvasWidth] = useState(512);
  const [canvasHeight, setCanvasHeight] = useState(256);
  const [paddingX, setPaddingX] = useState(10);
  const [paddingY, setPaddingY] = useState(5);
  const targetRef = useRef<HTMLDivElement>(null);

  const applyColorPreset = useCallback(
    (preset: ColorPreset) => {
      setTitle({
        textColor: preset.textColor,
        outlineColor: preset.outlineColor,
      });
      setQuote({
        textColor: preset.invertQuote ? preset.outlineColor : preset.textColor,
        outlineColor: preset.invertQuote
          ? preset.textColor
          : preset.outlineColor,
      });
      setDescription({
        textColor: preset.textColor,
        outlineColor: preset.outlineColor,
      });
      setBgColor(preset.bgColor);
      setBorderColor(preset.borderColor);
    },
    [setDescription, setQuote, setTitle],
  );

  useEffect(() => {
    applyColorPreset(colorPresets[0]);
  }, [applyColorPreset]);

  const handleDownloadSVG = () => {
    const target = targetRef.current;
    if (!target) return;
    html2canvas(target).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "canvas.png";
      link.click();
      link.remove();
    });
  };

  return (
    <Container>
      <Stack>
        <Title>Text to Image Generator</Title>
        <TextPropsView title="Title" text={title} setText={setTitle} />
        <TextPropsView title="Quote" text={quote} setText={setQuote} />
        <TextPropsView
          title="Description"
          text={description}
          setText={setDescription}
        />
        <Grid>
          <Grid.Col span={3}>
            <NumberInput
              value={paddingX}
              onChange={(e) => setPaddingX(Number(e))}
              label="Padding X"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              value={paddingY}
              onChange={(e) => setPaddingY(Number(e))}
              label="Padding Y"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              value={borderWidth}
              onChange={(e) => setBorderWidth(Number(e))}
              label="Border Width"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ColorInput
              label="Background Color"
              format="rgba"
              value={bgColor}
              onChange={(e) => setBgColor(e)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ColorInput
              label="Border Color"
              format="rgba"
              value={borderColor}
              onChange={(e) => setBorderColor(e)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Autocomplete
              type="number"
              min={1}
              value={`${canvasWidth}`}
              onChange={(e) => setCanvasWidth(Number(e))}
              label="Canvas Width"
              data={["128", "256", "512", "1024", "2048", "4096"]}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Autocomplete
              type="number"
              min={1}
              value={`${canvasHeight}`}
              onChange={(e) => setCanvasHeight(Number(e))}
              label="Canvas Height"
              data={["128", "256", "512", "1024", "2048", "4096"]}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            {colorPresets.map((preset, index) => (
              <Button
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                onClick={() => applyColorPreset(preset)}
                color={preset.outlineColor}
                style={{ marginRight: "1em" }}
              >
                {" "}
              </Button>
            ))}
          </Grid.Col>
        </Grid>
        <Button onClick={handleDownloadSVG}>Download PNG</Button>
      </Stack>
      <div style={{ marginTop: "1em" }}>
        <div
          ref={targetRef}
          style={{
            margin: "auto",
            width: canvasWidth,
            height: canvasHeight,
            border: `${borderWidth}px solid ${borderColor}`,
            boxSizing: "border-box",
            backgroundColor: bgColor,
            position: "relative",
            padding: `${paddingY}px ${paddingX}px`,
          }}
        >
          <DrawText props={title} />
          <DrawText props={quote} />
          <DrawText props={description} />
        </div>
      </div>
    </Container>
  );
}

export default App;
