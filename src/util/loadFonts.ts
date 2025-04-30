import { useEffect, useState } from "react";

const fontfaces = [
  new FontFace(
    "GenEi POPle Black",
    `local("GenEi POPle Black"),
    url("/public/GenEiPOPle_v1.0/GenEiPOPle-Bk.ttf")`,
  ),
  new FontFace(
    "GenEi POPle Pw Black",
    `local("GenEi POPle Pw Black"),
    url("/public/GenEiPOPle_v1.0/GenEiPOPlePw-Bk.ttf")`,
  ),
  new FontFace(
    "GenEi Nu Gothic EB",
    `local("GenEi Nu Gothic EB"),
    url("/public/GenEiNuGothic-EB_v1.1/GenEiNuGothic-EB.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Black",
    `local("GenEi M Gothic v2 Black"),
    url("/public/GenEiMGothic_v2.0/GenEiMGothic2-Black.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Bold",
    `local("GenEi M Gothic v2 Bold"),
    url("/public/GenEiMGothic_v2.0/GenEiMGothic2-Bold.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Heavy",
    `local("GenEi M Gothic v2 Heavy"),
    url("/public/GenEiMGothic_v2.0/GenEiMGothic2-Heavy.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Medium",
    `local("GenEi M Gothic v2 Medium"),
    url("/public/GenEiMGothic_v2.0/GenEiMGothic2-Medium.ttf")`,
  ),
  new FontFace(
    "GenEi M Gothic v2 Regular",
    `local("GenEi M Gothic v2 Regular"),
    url("/public/GenEiMGothic_v2.0/GenEiMGothic2-Regular.ttf")`,
  ),
  new FontFace(
    "GenEi LateGo v2 Medium",
    `local("GenEi LateGo v2 Medium"),
    url("/public/GenEiLatin-Separate_v2.1/GenEiLateGoN_v2.ttf")`,
  ),
  new FontFace(
    "GenEi LateGo P v2 Medium",
    `local("GenEi LateGo P v2 Medium"),
    url("/public/GenEiLatin-Separate_v2.1/GenEiLateGoP_v2.ttf")`,
  ),
  new FontFace(
    "GenEi LateMin v2 Medium",
    `local("GenEi LateMin v2 Medium"),
    url("/public/GenEiLatin-Separate_v2.1/GenEiLateMinN_v2.ttf")`,
  ),
  new FontFace(
    "GenEi LateMin P v2 Medium",
    `local("GenEi LateMin P v2 Medium"),
    url("/public/GenEiLatin-Separate_v2.1/GenEiLateMinP_v2.ttf")`,
  ),
  new FontFace(
    "GenEi Antique v5 Medium",
    `local("GenEi Antique v5 Medium"),
    url("/public/GenEiAntique_v5.1a/GenEiAntiqueNv5-M.ttf")`,
  ),
  new FontFace(
    "GenEi Antique Pv5 Medium",
    `local("GenEi Antique Pv5 Medium"),
    url("/public/GenEiAntique_v5.1a/GenEiAntiquePv5-M.ttf")`,
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
    for (const setFonts of setFontsEvents) {
      setFonts(fonts);
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
