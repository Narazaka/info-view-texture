import {
  Button,
  ColorInput,
  Container,
  Grid,
  Group,
  NumberInput,
  Stack,
  Title,
} from "@mantine/core";
import { useState, useRef, useEffect, useReducer } from "react";
import { useDebouncedCallback } from "use-debounce";
import { drawText } from "./util/drawText";
import type { TextProps } from "./util/TextProps";
import { TextPropsView } from "./TextPropsView";
import { useFonts } from "./util/fonts";

const defaultTextProps: TextProps = {
  text: "",
  textColor: "#333",
  strokeColor: "#000",
  strokeWidth: 5,
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
  const fonts = useFonts();
  const [title, setTitle] = useTextProps({
    text: "最強無敵生物",
    fontFamily: "GenEi Nu Gothic EB",
    fontSize: 52,
  });
  const [quote, setQuote] = useTextProps({
    text: "「私は最強無敵生物」",
    fontFamily: "GenEi POPle Black",
  });
  const [description, setDescription] = useTextProps({
    text: "これは説明です\nとてもつよい",
    fontFamily: "GenEi Nu Gothic EB",
  });
  const [bgColor, setBgColor] = useState("#fff");
  const [borderColor, setBorderColor] = useState("#000");
  const [borderWidth, setBorderWidth] = useState(12);
  const [canvasWidth, setCanvasWidth] = useState(512);
  const [canvasHeight, setCanvasHeight] = useState(256);
  const [padding, setPadding] = useState(22);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set background color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth * 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        let y = padding;
        // Draw title
        if (title) {
          y += drawText({
            ctx,
            y,
            padding,
            props: title,
          });
        }

        // Draw quote
        if (quote) {
          y += drawText({
            ctx,
            y,
            padding,
            props: quote,
          });
        }

        // Draw description
        if (description) {
          drawText({
            ctx,
            y,
            padding,
            props: description,
          });
        }
      }
    }
  };

  const debouncedDrawCanvas = useDebouncedCallback(drawCanvas, 300);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    debouncedDrawCanvas();
  }, [
    title,
    quote,
    description,
    bgColor,
    borderColor,
    borderWidth,
    canvasWidth,
    canvasHeight,
    padding,
    debouncedDrawCanvas,
    fonts,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
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
              value={padding}
              onChange={(e) => setPadding(Number(e))}
              label="Padding"
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
            <NumberInput
              value={canvasWidth}
              onChange={(e) => setCanvasWidth(Number(e))}
              label="Canvas Width"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              value={canvasHeight}
              onChange={(e) => setCanvasHeight(Number(e))}
              label="Canvas Height"
            />
          </Grid.Col>
        </Grid>
        <Button onClick={handleDownload}>Download Image</Button>
      </Stack>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px dashed #000" }}
      />
    </Container>
  );
}

export default App;
