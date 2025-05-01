import { Combobox, Text, TextInput, useCombobox } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import Fuse from "fuse.js";
import { memo, useMemo } from "react";

function FontOption({
  font,
}: {
  font: string;
}) {
  return (
    <Combobox.Option value={font}>
      <Text component="span" ff={`"${font}"`}>
        あ愛A1
      </Text>{" "}
      <Text component="span" size="xs">
        {font}
      </Text>
    </Combobox.Option>
  );
}

function FontSelector({
  fonts,
  fontFamily,
  setFontFamily,
}: {
  fonts: string[];
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
}) {
  const combobox = useCombobox();
  const fuse = useMemo(() => new Fuse(fonts), [fonts]);
  const filteredFonts = fuse.search(fontFamily);
  /*
  const filteredFonts = fonts.filter((font) =>
    font.replace(" ", "").toLowerCase().includes(fontFamilyLower),
  );
  */
  const options =
    fontFamily === ""
      ? fonts.map((font) => <FontOption key={font} font={font} />)
      : fonts.indexOf(fontFamily) !== -1 // exact match
        ? [fontFamily]
            .map((font) => <FontOption key={font} font={font} />)
            .concat([
              <Combobox.Group key="all" label="すべてのフォント">
                {fonts.map((font) => (
                  <FontOption key={font} font={font} />
                ))}
              </Combobox.Group>,
            ])
        : filteredFonts.map((font) => (
            <FontOption key={font.item} font={font.item} />
          ));
  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(optionValue) => {
        setFontFamily(optionValue);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <TextInput
          label="Font Family"
          size="xs"
          value={fontFamily}
          onChange={(event) => {
            setFontFamily(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options mah={380} style={{ overflowY: "auto" }}>
          {options.length === 0 ? (
            <Combobox.Empty>なし</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

const FontSelectorMemo = memo(FontSelector);

function FontSelectorDebounced({
  fonts,
  fontFamily,
  setFontFamily,
}: {
  fonts: string[];
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
}) {
  return (
    <FontSelectorMemo
      fonts={useDebouncedValue(fonts, 100)[0]}
      fontFamily={fontFamily}
      setFontFamily={setFontFamily}
    />
  );
}

export default FontSelectorDebounced;
