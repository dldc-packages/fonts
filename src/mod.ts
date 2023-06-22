const FONT_WEIGHT_OBJS = [
  { num: 100, alias: ['Thin'] },
  { num: 200, alias: ['ExtraLight', 'UltraLight'] },
  { num: 300, alias: ['Light'] },
  { num: 400, alias: ['Normal', 'Book', 'Regular'] },
  { num: 500, alias: ['Medium'] },
  { num: 600, alias: ['SemiBold', 'DemiBold'] },
  { num: 700, alias: ['Bold'] },
  { num: 800, alias: ['ExtraBold', 'UltraBold'] },
  { num: 900, alias: ['Black', 'Heavy'] },
] as const;

const FONT_WEIGHT_NAMES: ReadonlyArray<{ weight: FontWeight; num: FontWeightNum }> = FONT_WEIGHT_OBJS.reduce<
  Array<{ weight: FontWeight; num: FontWeightNum }>
>((acc, item) => {
  acc.push({ weight: item.num, num: item.num });
  item.alias.forEach((alias) => {
    acc.push({ weight: alias, num: item.num });
  });
  return acc;
}, []);

export type FontWeightObjs = typeof FONT_WEIGHT_OBJS;

export type AnyFontWeightObj = FontWeightObjs[number];

export type FontWeightNum = AnyFontWeightObj['num'];

export type FontWeightAlias = AnyFontWeightObj['alias'][number];

export type FontWeight = FontWeightNum | FontWeightAlias;

export type FontWeightAliasFromNum<N extends FontWeightNum> = Extract<AnyFontWeightObj, { num: N }>['alias'][number];

export type FontWeightFromNum<N extends FontWeightNum> = N | FontWeightAliasFromNum<N>;

export type FontWeightNumFromAlias<A extends FontWeightAlias> = {
  [N in FontWeightNum]: A extends FontWeightAliasFromNum<N> ? N : never;
}[FontWeightNum];

export type FontWeightToNum<N extends FontWeight> = N extends FontWeightAlias
  ? FontWeightNumFromAlias<N>
  : N extends number
  ? N
  : never;

export const Font = {
  resolveFontWeight,
  create: createFont,
  factory,
};

function resolveFontWeight(weight: FontWeight): FontWeightNum {
  if (typeof weight === 'number') {
    return weight;
  }
  const obj = FONT_WEIGHT_OBJS.find((w) => (w.alias as any).includes(weight));
  if (!obj) {
    throw new Error(`Invalid font weight: ${weight}`);
  }
  return obj.num;
}

export type CSSFontObj = {
  fontFamily: string;
  fontWeight: FontWeightNum;
  fontStyle: 'italic' | 'normal';
};

export type FontWeightConfigBoth<T> = {
  normal: T;
  italic: T;
};
export type FontWeightConfigItalic<T> = { italic: T };
export type FontWeightConfigNormal<T> = { normal: T };

export type FontWeightConfig<T> = FontWeightConfigBoth<T> | FontWeightConfigItalic<T> | FontWeightConfigNormal<T>;

export type FontWeightConfigAny = FontWeightConfig<any>;

export type FontConfig<T> = {
  [K in FontWeightNum]?: FontWeightConfig<T>;
};

export type FontConfigAny = FontConfig<any>;

export type FontConfigAllWeights<T extends FontConfigAny> = keyof T extends FontWeightNum
  ? FontWeightFromNum<keyof T>
  : never;

export type FontWeightStyle<T extends FontWeightConfigAny> = T extends FontWeightConfigBoth<any>
  ? { Normal: CSSFontObj; Italic: CSSFontObj }
  : CSSFontObj;

export type ExtractFontWeightStyle<
  T extends FontConfigAny,
  W extends FontWeight
> = T[FontWeightToNum<W>] extends FontWeightConfigAny ? FontWeightStyle<T[FontWeightToNum<W>]> : never;

export type FontStyles<T extends FontConfigAny> = {
  [W in FontConfigAllWeights<T>]: ExtractFontWeightStyle<T, W>;
};

export type FontWeightRule<D> = {
  fontFamily: string;
  fontWeight: number;
  fontStyle: 'italic' | 'normal';
  data: D;
};

export interface Font<D, T extends FontConfig<D>> {
  name: string;
  styles: FontStyles<T>;
  rules: Array<FontWeightRule<D>>;
}

function factory<D>() {
  return <F extends FontConfig<D>>(name: string, config: F): Font<D, F> => {
    return createFont(name, config);
  };
}

function createFont<D, F extends FontConfig<D>>(name: string, config: F): Font<D, F> {
  return {
    name,
    styles: createStyle(name, config),
    rules: createFontWeightRules(name, config),
  };
}

function createStyle<T extends FontConfigAny>(name: string, config: T): FontStyles<T> {
  const cache: { [K in FontWeightNum]?: FontWeightStyle<any> | null } = {};

  return FONT_WEIGHT_NAMES.reduce<FontStyles<T>>((acc, { weight, num }) => {
    const conf: FontWeightConfigAny | undefined = (config as any)[num];
    if (conf === undefined) {
      return acc;
    }
    const styles = cache[num] || (cache[num] = createWeightStyle(name, num, conf));
    if (styles !== null) {
      (acc as any)[weight] = styles;
    }
    return acc;
  }, {} as any);
}

function createWeightStyle(
  name: string,
  num: FontWeightNum,
  config: FontWeightConfigAny
): FontWeightStyle<FontWeightConfigAny> | null {
  if ('italic' in config && 'normal' in config) {
    return {
      Italic: { fontFamily: name, fontWeight: num, fontStyle: 'italic' },
      Normal: { fontFamily: name, fontWeight: num },
    } as any;
  }
  if ('italic' in config) {
    return { fontFamily: name, fontWeight: num, fontStyle: 'italic' } as any;
  }
  if ('normal' in config) {
    return { fontFamily: name, fontWeight: num } as any;
  }
  /* istanbul ignore next */
  return null;
}

function createFontWeightRules<D>(name: string, config: FontConfigAny): Array<FontWeightRule<D>> {
  const result: Array<FontWeightRule<D>> = [];
  FONT_WEIGHT_OBJS.forEach((obj) => {
    const conf = config[obj.num];
    if (!conf) {
      return;
    }
    if ('italic' in conf) {
      result.push({
        fontFamily: name,
        fontWeight: obj.num,
        fontStyle: 'italic',
        data: conf.italic,
      });
    }
    if ('normal' in conf) {
      result.push({
        fontFamily: name,
        fontWeight: obj.num,
        fontStyle: 'normal',
        data: conf.normal,
      });
    }
  });
  return result;
}

// Woff utils

export type FontWeightWoffData = string | { woff: string; woff2: string };

export const WoffFont = {
  createWoff: factory<FontWeightWoffData>(),
  createFontFace: createWoffFontFace,
};

function createWoffFontFace(rules: Array<FontWeightRule<FontWeightWoffData>>): string {
  return rules.map((rule) => serializeWoffFontFaceRule(rule)).join('\n\n');
}

function serializeWoffFontFaceRule(rule: FontWeightRule<FontWeightWoffData>): string {
  const paths = rule.data;
  const woff = typeof paths === 'string' ? paths + '.woff' : paths.woff;
  const woff2 = typeof paths === 'string' ? paths + '.woff2' : paths.woff2;
  const src = `url('${woff}') format('woff2'), url('${woff2}') format('woff')`;

  return [
    `@font-face {`,
    `  font-family: '${rule.fontFamily}';`,
    `  font-weight: ${rule.fontWeight};`,
    `  font-style: ${rule.fontStyle};`,
    `  src: ${src};`,
    `}`,
  ].join('\n');
}
