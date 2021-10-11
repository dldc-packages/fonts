export type FontWeight_100 = 100 | 'Thin';
export type FontWeight_200 = 200 | 'ExtraLight' | 'UltraLight';
export type FontWeight_300 = 300 | 'Light';
export type FontWeight_400 = 400 | 'Normal' | 'Book' | 'Regular';
export type FontWeight_500 = 500 | 'Medium';
export type FontWeight_600 = 600 | 'SemiBold' | 'DemiBold';
export type FontWeight_700 = 700 | 'Bold';
export type FontWeight_800 = 800 | 'ExtraBold' | 'UltraBold';
export type FontWeight_900 = 900 | 'Black' | 'Heavy';

export interface FontByWeightNum {
  100: FontWeight_100;
  200: FontWeight_200;
  300: FontWeight_300;
  400: FontWeight_400;
  500: FontWeight_500;
  600: FontWeight_600;
  700: FontWeight_700;
  800: FontWeight_800;
  900: FontWeight_900;
}

export type FontWeight =
  | FontWeight_100
  | FontWeight_200
  | FontWeight_300
  | FontWeight_400
  | FontWeight_500
  | FontWeight_600
  | FontWeight_700
  | FontWeight_800
  | FontWeight_900;

export type FontWeightNum = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export const FontWeightNames: { [K in FontWeight]: FontWeightNum } = {
  Thin: 100,
  ExtraLight: 200,
  UltraLight: 200,
  Light: 300,
  Normal: 400,
  Book: 400,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  DemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  UltraBold: 800,
  Black: 900,
  Heavy: 900,
  100: 100,
  200: 200,
  300: 300,
  400: 400,
  500: 500,
  600: 600,
  700: 700,
  800: 800,
  900: 900,
};

export const Font = {
  resolveFontWeight,
  create: createFont,
};

function resolveFontWeight(weight: FontWeight): FontWeightNum {
  return FontWeightNames[weight];
}

export type CSSFontObj = {
  fontFamily: string;
  fontWeight: FontWeightNum;
  fontStyle: 'italic' | 'normal';
};

export interface FontWeightPaths {
  woff: string;
  woff2: string;
}

export type FontWeightConfigBoth = {
  normal: FontWeightPaths | string;
  italic: FontWeightPaths | string;
};
export type FontWeightConfigItalic = { italic: FontWeightPaths | string };
export type FontWeightConfigNormal = { normal: FontWeightPaths | string };

export type FontWeightConfig =
  | FontWeightConfigBoth
  | FontWeightConfigItalic
  | FontWeightConfigNormal;

export type FontConfig = {
  [K in FontWeightNum]?: FontWeightConfig;
};

type AllWeight<T extends FontConfig> = {
  [K in keyof T]: K extends FontWeightNum ? FontByWeightNum[K] : never;
}[keyof T];

type WeightNumFromWeight<T extends FontWeight> = {
  [K in keyof FontByWeightNum]: T extends FontByWeightNum[K] ? K : never;
}[keyof FontByWeightNum];

type FontWeightStyle<T extends FontWeightConfig> = T extends FontWeightConfigBoth
  ? { Normal: CSSFontObj; Italic: CSSFontObj }
  : CSSFontObj;

type FontStyles<T extends FontConfig> = {
  [W in AllWeight<T>]: FontWeightStyle<T[WeightNumFromWeight<W>]>;
};

export type FontFaceRule = {
  fontFamily: string;
  src: string;
  fontWeight: number;
  fontStyle: 'italic' | 'normal';
};

export interface Font<T extends FontConfig> {
  name: string;
  fontFaces: string;
  fontFacesRules: Array<FontFaceRule>;
  styles: FontStyles<T>;
}

export function createFont<F extends FontConfig>(name: string, config: F): Font<F> {
  const rules = createFontFaceRules(name, config);
  return {
    name,
    fontFacesRules: rules,
    fontFaces: serializeFontFaceRules(rules),
    styles: createStyle(name, config),
  };
}

function serializeFontFaceRules(rules: Array<FontFaceRule>): string {
  return rules.map((rule) => serializeFontFaceRule(rule)).join('\n\n');
}

function serializeFontFaceRule(rule: FontFaceRule): string {
  return [
    `@font-face {`,
    `  font-family: '${rule.fontFamily}';`,
    `  src: ${rule.src};`,
    `  font-weight: ${rule.fontWeight};`,
    `  font-style: ${rule.fontStyle};`,
    `}`,
  ].join('\n');
}

function createFontFaceRules(name: string, config: FontConfig): Array<FontFaceRule> {
  return Object.keys(config)
    .map((weight) => {
      return createWeightFontFaceRules(name, parseInt(weight, 10), (config as any)[weight]);
    })
    .flat()
    .filter((v): v is FontFaceRule => v !== null);
}

function createWeightFontFaceRules(
  name: string,
  weight: number,
  config: FontWeightConfig
): Array<FontFaceRule | null> {
  return [
    'italic' in config ? createSingleFontFaceRule(name, weight, true, config.italic) : null,
    'normal' in config ? createSingleFontFaceRule(name, weight, false, config.normal) : null,
  ];
}

function createSingleFontFaceRule(
  name: string,
  weight: number,
  italic: boolean,
  paths: FontWeightPaths | string
): FontFaceRule {
  const woff = typeof paths === 'string' ? paths + '.woff' : paths.woff;
  const woff2 = typeof paths === 'string' ? paths + '.woff2' : paths.woff2;
  return {
    fontFamily: name,
    fontStyle: italic ? 'italic' : 'normal',
    fontWeight: weight,
    src: `url('${woff}') format('woff2'), url('${woff2}') format('woff')`,
  };
}

function createStyle<T extends FontConfig>(name: string, config: T): FontStyles<T> {
  const cache: { [K in FontWeightNum]?: FontWeightStyle<any> | null } = {};

  return Object.keys(FontWeightNames).reduce<FontStyles<T>>((acc, weight) => {
    const weightNum = resolveFontWeight(weight as any);
    const conf: FontWeightConfig | undefined = (config as any)[weightNum];
    if (conf === undefined) {
      return acc;
    }
    const styles = cache[weightNum] || createWeightStyle(name, weightNum, conf);
    if (!cache[weightNum]) {
      cache[weightNum] = styles;
    }
    if (styles !== null) {
      (acc as any)[weight] = styles;
    }
    return acc;
  }, {} as any);
}

function createWeightStyle<T extends FontWeightConfig>(
  name: string,
  weight: FontWeightNum,
  config: T
): FontWeightStyle<T> | null {
  if ('italic' in config && 'normal' in config) {
    return {
      Italic: {
        fontFamily: name,
        fontWeight: weight,
        fontStyle: 'italic',
      },
      Normal: {
        fontFamily: name,
        fontWeight: weight,
      },
    } as any;
  }
  if ('italic' in config) {
    return {
      fontFamily: name,
      fontWeight: weight,
      fontStyle: 'italic',
    } as any;
  }
  if ('normal' in config) {
    return {
      fontFamily: name,
      fontWeight: weight,
    } as any;
  }
  /* istanbul ignore next */
  return null;
}
