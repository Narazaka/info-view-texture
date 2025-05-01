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
import {
  useState,
  useRef,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import type { TextProps } from "./util/TextProps";
import TextPropsView from "./TextPropsView";
import { useLocalStorage } from "@mantine/hooks";
import { useFonts } from "./util/fonts";
import { draw } from "./util/draw";

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
    outlineColor: "rgba(255, 255, 255, 0)",
    bgColor: "#000",
    borderColor: "#fff",
    invertQuote: false,
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
  outlineType: "thick",
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
  const [paddingX, setPaddingX] = useState(9);
  const [paddingY, setPaddingY] = useState(10);
  const targetRef = useRef<HTMLCanvasElement>(null);

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

  const handleDownload = () => {
    const target = targetRef.current;
    if (!target) return;
    const link = document.createElement("a");
    link.href = target.toDataURL("image/png");
    link.download = `${title.text || "canvas"}.png`;
    link.click();
    link.remove();
  };

  const drawParams = useMemo(
    () => ({
      borderWidth,
      bgColor,
      borderColor,
      paddingX,
      paddingY,
      title,
      quote,
      description,
    }),
    [
      borderWidth,
      bgColor,
      borderColor,
      paddingX,
      paddingY,
      title,
      quote,
      description,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const canvas = targetRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw({
      ctx,
      ...drawParams,
    });
  }, [drawParams, fonts]);

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
          用のテクスチャを作るやつです。
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
          title="タイトル"
          text={title}
          setText={setTitle}
          fonts={fonts}
        />
        <TextPropsView
          title="台詞？"
          text={quote}
          setText={setQuote}
          fonts={fonts}
        />
        <TextPropsView
          title="説明？"
          text={description}
          setText={setDescription}
          fonts={fonts}
        />
        <Grid align="center">
          <Grid.Col span={1.5}>
            <ColorInput
              label="背景色"
              size="xs"
              format="rgba"
              value={bgColor}
              onChange={(e) => setBgColor(e)}
            />
          </Grid.Col>
          <Grid.Col span={1.5}>
            <ColorInput
              label="ふち色"
              size="xs"
              format="rgba"
              value={borderColor}
              onChange={(e) => setBorderColor(e)}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              value={paddingX}
              onChange={(e) => setPaddingX(Number(e))}
              label="余白 ←→"
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              value={paddingY}
              onChange={(e) => setPaddingY(Number(e))}
              label="余白 ↑↓"
            />
          </Grid.Col>
          <Grid.Col span={1.5}>
            <NumberInput
              size="xs"
              value={borderWidth}
              onChange={(e) => setBorderWidth(Number(e))}
              label="ふち幅"
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={1.5}>
            <Autocomplete
              type="number"
              size="xs"
              min={1}
              value={`${canvasWidth}`}
              onChange={(e) => setCanvasWidth(Number(e))}
              label="画像幅"
              data={["128", "256", "512", "1024", "2048", "4096"]}
            />
          </Grid.Col>
          <Grid.Col span={1.5}>
            <Autocomplete
              type="number"
              size="xs"
              min={1}
              value={`${canvasHeight}`}
              onChange={(e) => setCanvasHeight(Number(e))}
              label="画像高さ"
              data={["128", "256", "512", "1024", "2048", "4096"]}
            />
          </Grid.Col>
          <Grid.Col span={2.5}>
            <Button w="100%" onClick={handleDownload}>
              画像をダウンロード
            </Button>
          </Grid.Col>
          <Grid.Col span={12}>
            {colorPresets.map((preset, index) => (
              <Button
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                onClick={() => applyColorPreset(preset)}
                color={preset.outlineColor}
                bd="1px dotted gray"
                style={{ marginRight: "1em" }}
              >
                {" "}
              </Button>
            ))}
          </Grid.Col>
        </Grid>
      </Stack>
      <div
        style={{
          marginTop: ".5em",
          paddingTop: ".5em",
          textAlign: "center",
          backgroundImage: `repeating-conic-gradient(from 0deg,
		#ffffff 0deg 90deg,
		#cccccc 90deg 180deg`,
          backgroundSize: "30px 30px",
          backgroundColor: "#fff",
        }}
      >
        <canvas ref={targetRef} width={canvasWidth} height={canvasHeight} />
      </div>
    </Container>
  );
}

export default App;
