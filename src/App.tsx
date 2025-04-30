import {
  Alert,
  Autocomplete,
  Button,
  ColorInput,
  Container,
  Grid,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState, useRef, useReducer, useCallback, useEffect } from "react";
import type { TextProps } from "./util/TextProps";
import { TextPropsView } from "./TextPropsView";
import DrawText from "./DrawText";
import rasterizehtml from "rasterizehtml";
import { useLocalStorage } from "@mantine/hooks";
import { useFonts } from "./util/fonts";

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
  scaleX: 1,
  charWrap: true,
};
const useTextProps = (initialState: Partial<TextProps> = {}) => {
  const [props, setProps] = useReducer(
    (state, action: Partial<TextProps>) => ({ ...state, ...action }),
    { ...defaultTextProps, ...initialState },
  );
  return [props, setProps] as const;
};

const fontsAllowedStatus = {
  ask: 0,
  allow: 1,
  deny: 2,
};

function App() {
  const [fontsAllowed, setFontsAllowed] = useLocalStorage({
    key: "fonts-allowed",
    defaultValue: fontsAllowedStatus.ask,
  });
  const fonts = useFonts(fontsAllowed === fontsAllowedStatus.allow);

  const [title, setTitle] = useTextProps({
    text: "丸メガネ",
    fontFamily: "Rounded-X Mgen+ 1p black",
    fontSize: 52,
    textColor: "#fff",
    outlineColor: "#ff00a5",
  });
  const [quote, setQuote] = useTextProps({
    text: "「メガネっていいよね！」",
    fontFamily: "GenEi POPle Black",
    textColor: "#ff00a5",
    outlineColor: "#fff",
  });
  const [description, setDescription] = useTextProps({
    text: "VRChat用メガネ案外豊富で良い",
    fontFamily: "Rounded-X Mgen+ 1p heavy",
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
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    rasterizehtml
      .drawHTML(
        `<html><head><style>html,body{padding:0;margin:0}</style></head><body>${
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          target.parentElement!.innerHTML
        }</body></html>`,
        canvas,
      )
      .then(() => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "canvas.png";
        link.click();
        link.remove();
        canvas.remove();
      });
  };

  return (
    <Container>
      <Stack>
        <Title>Info View Texture</Title>
        <Text>
          <a
            href="https://narazaka.booth.pm/items/6837074"
            target="_blank"
            rel="noopener noreferrer"
          >
            Info View Shader
          </a>
          用のテクスチャを作るやつです
        </Text>
        {fontsAllowed !== fontsAllowedStatus.allow && (
          <Alert>
            <Title>ローカルフォント一覧を許可</Title>
            <p>
              PCにインストールされているフォントを名前補完するには、ローカルフォントの読み込みを許可してください。
            </p>
            <Button
              onClick={() => {
                setFontsAllowed(fontsAllowedStatus.allow);
              }}
            >
              Allow
            </Button>
          </Alert>
        )}
        <TextPropsView
          title="Title"
          text={title}
          setText={setTitle}
          fonts={fonts}
        />
        <TextPropsView
          title="Quote"
          text={quote}
          setText={setQuote}
          fonts={fonts}
        />
        <TextPropsView
          title="Description"
          text={description}
          setText={setDescription}
          fonts={fonts}
        />
        <Grid>
          <Grid.Col span={1.5}>
            <NumberInput
              value={paddingX}
              onChange={(e) => setPaddingX(Number(e))}
              label="Padding X"
            />
          </Grid.Col>
          <Grid.Col span={1.5}>
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
            margin: "0 auto",
            width: canvasWidth,
            height: canvasHeight,
            border: `${borderWidth}px solid ${borderColor}`,
            boxSizing: "border-box",
            backgroundColor: bgColor,
            position: "relative",
            padding: `${paddingY}px ${paddingX}px`,
          }}
        >
          <DrawText
            props={title}
            width={canvasWidth - (paddingX + borderWidth) * 2}
          />
          <DrawText
            props={quote}
            width={canvasWidth - (paddingX + borderWidth) * 2}
          />
          <DrawText
            props={description}
            width={canvasWidth - (paddingX + borderWidth) * 2}
          />
        </div>
      </div>
    </Container>
  );
}

export default App;
