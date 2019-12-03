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

export interface FontWeightConfig {
  normal?: FontWeightPaths;
  italic?: FontWeightPaths;
}

export type FontConfig = {
  [K in FontWeightNum]?: FontWeightConfig;
};

type AllWeight<T extends FontConfig> = {
  [K in keyof T]: K extends FontWeightNum ? FontByWeightNum[K] : never;
}[keyof T];

type WeightNumFromWeight<T extends FontWeight> = {
  [K in keyof FontByWeightNum]: T extends FontByWeightNum[K] ? K : never;
}[keyof FontByWeightNum];

type FontWeightConfigBoth = Required<FontWeightConfig>;

type FontWeightStyle<T extends FontWeightConfig> = T extends FontWeightConfigBoth
  ? { Normal: CSSFontObj; Italic: CSSFontObj }
  : CSSFontObj;

type FontStyles<T extends FontConfig> = {
  [W in AllWeight<T>]: FontWeightStyle<T[WeightNumFromWeight<W>]>;
};

export interface Font<T extends FontConfig> {
  fontFaces: string;
  styles: FontStyles<T>;
}

export function createFont<F extends FontConfig>(name: string, config: F): Font<F> {
  return {
    fontFaces: createFontFace(name, config),
    styles: createStyle(name, config),
  };
}

function createFontFace(name: string, config: FontConfig): string {
  return Object.keys(config).reduce((acc, weight) => {
    return acc + createWeightFontFace(name, parseInt(weight, 10), (config as any)[weight]);
  }, '');
}

function createWeightFontFace(name: string, weight: number, config: FontWeightConfig): string {
  return [
    config.italic ? createSingleFontFace(name, weight, true, config.italic) : '',
    config.normal ? createSingleFontFace(name, weight, false, config.normal) : '',
  ].join('');
}

function createSingleFontFace(
  name: string,
  weight: number,
  italic: boolean,
  paths: FontWeightPaths
) {
  return `
    @font-face {
      font-family: '${name}';
      src: url('${paths.woff2}') format('woff2'),
          url('${paths.woff}') format('woff');
      font-weight: ${weight};
      font-style: ${italic ? 'italic' : 'normal'};
    }
  `;
}

function createStyle<T extends FontConfig>(name: string, config: T): FontStyles<T> {
  return Object.keys(FontWeightNames).reduce<FontStyles<T>>((acc, weight) => {
    const weightNum = resolveFontWeight(weight as any);
    if ((config as any)[weightNum] === undefined) {
      return acc;
    }
    (acc as any)[weight] = createWeightStyle(name, weightNum, (config as any)[weightNum]);
    return acc;
  }, {} as any);
}

function createWeightStyle<T extends FontWeightConfig>(
  name: string,
  weight: FontWeightNum,
  config: T
): FontWeightStyle<T> {
  if (config.italic && config.normal) {
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
  if (config.italic) {
    return {
      fontFamily: name,
      fontWeight: weight,
      fontStyle: 'italic',
    } as any;
  }
  if (config.normal) {
    return {
      fontFamily: name,
      fontWeight: weight,
    } as any;
  }
  return {} as any;
}
