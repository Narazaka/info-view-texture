import {
  Grid,
  Textarea,
  NumberInput,
  ColorInput,
  Switch,
  Select,
  Autocomplete,
  Slider,
} from "@mantine/core";
import type { TextProps } from "./util/TextProps";

export function TextPropsView({
  title,
  text,
  setText,
  fonts,
}: {
  title: string;
  text: TextProps;
  setText: (newTitle: Partial<TextProps>) => void;
  fonts: string[];
}) {
  return (
    <Grid align="center">
      <Grid.Col span={3}>
        <Textarea
          label={title}
          value={text.text}
          onChange={(e) => setText({ text: e.target.value })}
        />
      </Grid.Col>
      <Grid.Col span={9}>
        <Grid>
          <Grid.Col span={2}>
            <NumberInput
              label="Font Size"
              size="xs"
              value={text.fontSize}
              onChange={(value) => setText({ fontSize: Number(value) })}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              label="Line Height"
              size="xs"
              value={text.lineHeight}
              onChange={(value) => setText({ lineHeight: Number(value) })}
              step={0.1}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              label="Stroke Width"
              size="xs"
              value={text.outlineWidth}
              onChange={(value) => setText({ outlineWidth: Number(value) })}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              label="Scale X"
              size="xs"
              value={text.scaleX}
              onChange={(value) => setText({ scaleX: Number(value) })}
            />
            <Slider
              label="Scale X"
              value={text.scaleX}
              step={0.01}
              min={0.2}
              max={2}
              onChange={(value) => setText({ scaleX: Number(value) })}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Select
              label="Alignment"
              size="xs"
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

          <Grid.Col span={2}>
            <Switch
              label="Bold"
              size="xs"
              checked={text.fontWeight === "bold"}
              onChange={(e) =>
                setText({
                  fontWeight: e.currentTarget.checked ? "bold" : "normal",
                })
              }
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <ColorInput
              label="Text Color"
              size="xs"
              format="rgba"
              value={text.textColor}
              onChange={(value) => setText({ textColor: value })}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <ColorInput
              label="Stroke Color"
              size="xs"
              format="rgba"
              value={text.outlineColor}
              onChange={(value) => setText({ outlineColor: value })}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Autocomplete
              label="Font Family"
              size="xs"
              value={text.fontFamily}
              onChange={(value) => setText({ fontFamily: value })}
              data={fonts}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}
