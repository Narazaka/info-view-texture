import { useEffect, useState } from "react";

const roundedMgenPlusWeights = [
  "black",
  "bold",
  "heavy",
  "light",
  "medium",
  "regular",
  "thin",
];
const roundedMgenPlusTypes = [
  "1c",
  "1cp",
  // "1m",
  // "1mn",
  "1p",
  "1pp",
  "2c",
  "2cp",
  // "2m",
  "2p",
  "2pp",
];

const fontfaces = [
  ...roundedMgenPlusWeights.flatMap((weight) =>
    roundedMgenPlusTypes.map((type) => {
      const name = `Rounded-X Mgen+ ${type} ${weight}`;
      return new FontFace(
        name,
        `local("${name}"), url("/rounded-x-mgenplus-20150602/rounded-x-mgenplus-${type}-${weight}.ttf")`,
      );
    }),
  ),
  new FontFace(
    "GenEi POPle Black",
    `local("GenEi POPle Black"),
    url("/GenEiPOPle_v1.0/GenEiPOPle-Bk.ttf")`,
  ),
  new FontFace(
    "GenEi POPle Pw Black",
    `local("GenEi POPle Pw Black"),
    url("/GenEiPOPle_v1.0/GenEiPOPlePw-Bk.ttf")`,
  ),
  new FontFace(
    "GenEi Nu Gothic EB",
    `local("GenEi Nu Gothic EB"),
    url("/GenEiNuGothic-EB_v1.1/GenEiNuGothic-EB.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Black",
    `local("GenEi M Gothic v2 Black"),
    url("/GenEiMGothic_v2.0/GenEiMGothic2-Black.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Bold",
    `local("GenEi M Gothic v2 Bold"),
    url("/GenEiMGothic_v2.0/GenEiMGothic2-Bold.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Heavy",
    `local("GenEi M Gothic v2 Heavy"),
    url("/GenEiMGothic_v2.0/GenEiMGothic2-Heavy.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Medium",
    `local("GenEi M Gothic v2 Medium"),
    url("/GenEiMGothic_v2.0/GenEiMGothic2-Medium.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Regular",
    `local("GenEi M Gothic v2 Regular"),
    url("/GenEiMGothic_v2.0/GenEiMGothic2-Regular.ttf")`,
  ),
  new FontFace(
    "GenEi LateGo v2 Medium",
    `local("GenEi LateGo v2 Medium"),
    url("/GenEiLatin-Separate_v2.1/GenEiLateGoN_v2.ttf")`,
  ),
  new FontFace(
    "GenEi LateGo P v2 Medium",
    `local("GenEi LateGo P v2 Medium"),
    url("/GenEiLatin-Separate_v2.1/GenEiLateGoP_v2.ttf")`,
  ),
  new FontFace(
    "GenEi LateMin v2 Medium",
    `local("GenEi LateMin v2 Medium"),
    url("/GenEiLatin-Separate_v2.1/GenEiLateMinN_v2.ttf")`,
  ),
  new FontFace(
    "GenEi LateMin P v2 Medium",
    `local("GenEi LateMin P v2 Medium"),
    url("/GenEiLatin-Separate_v2.1/GenEiLateMinP_v2.ttf")`,
  ),
  new FontFace(
    "GenEi Antique v5 Medium",
    `local("GenEi Antique v5 Medium"),
    url("/GenEiAntique_v5.1a/GenEiAntiqueNv5-M.ttf")`,
  ),
  new FontFace(
    "GenEi Antique Pv5 Medium",
    `local("GenEi Antique Pv5 Medium"),
    url("/GenEiAntique_v5.1a/GenEiAntiquePv5-M.ttf")`,
  ),
];

async function* loadFonts() {
  for (const fontface of fontfaces) {
    yield await fontface.load().then((fontface) => {
      document.fonts.add(fontface);
      return fontface;
    });
  }
}

const setFontsEvents = new Set<
  React.Dispatch<React.SetStateAction<string[]>>
>();

async function loadFontsAndReport() {
  const fonts = [];
  for await (const fontface of loadFonts()) {
    fonts.push(fontface.family);
    const newFonts = [...fonts];
    for (const setFonts of setFontsEvents) {
      setFonts(newFonts);
    }
  }
}

let loading: Promise<void>;

function loadFontsAndReportCached(
  setFonts: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setFontsEvents.add(setFonts);
  if (loading) {
    return loading;
  }
  loading = loadFontsAndReport();
  return loading;
}

export function useLoadFonts() {
  const [fonts, setFonts] = useState<string[]>([]);
  useEffect(() => {
    loadFontsAndReportCached(setFonts);
  }, []);
  return fonts;
}
