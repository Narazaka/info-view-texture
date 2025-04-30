import {
  Grid,
  Textarea,
  NumberInput,
  ColorInput,
  Switch,
  Select,
  Autocomplete,
} from "@mantine/core";
import type { TextProps } from "./util/TextProps";
import { useFonts } from "./util/fonts";

export function TextPropsView({
  title,
  text,
  setText,
}: {
  title: string;
  text: TextProps;
  setText: (newTitle: Partial<TextProps>) => void;
}) {
  const fonts = useFonts();
  return (
    <Grid>
      <Grid.Col span={6}>
        <Textarea
          label={title}
          value={text.text}
          onChange={(e) => setText({ text: e.target.value })}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Grid>
          <Grid.Col span={3}>
            <NumberInput
              label="Font Size"
              value={text.fontSize}
              onChange={(value) => setText({ fontSize: Number(value) })}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="Line Height"
              value={text.lineHeight}
              onChange={(value) => setText({ lineHeight: Number(value) })}
              step={0.1}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="Stroke Width"
              value={text.strokeWidth}
              onChange={(value) => setText({ strokeWidth: Number(value) })}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Alignment"
              value={text.textAlign}
              onChange={(value) =>
                setText({ textAlign: value as CanvasTextAlign })
              }
              data={
                [
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ] satisfies { value: CanvasTextAlign; label: string }[]
              }
            />
          </Grid.Col>

          <Grid.Col span={9}>
            <Autocomplete
              label="Font Family"
              value={text.fontFamily}
              onChange={(value) => setText({ fontFamily: value })}
              data={fonts}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Switch
              label="Bold"
              checked={text.fontWeight === "bold"}
              onChange={(e) =>
                setText({
                  fontWeight: e.currentTarget.checked ? "bold" : "normal",
                })
              }
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <ColorInput
              label="Text Color"
              format="rgba"
              value={text.textColor}
              onChange={(value) => setText({ textColor: value })}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <ColorInput
              label="Stroke Color"
              format="rgba"
              value={text.strokeColor}
              onChange={(value) => setText({ strokeColor: value })}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}
