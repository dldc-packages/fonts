# TS-Fonts [![Build Status](https://travis-ci.org/etienne-dldc/ts-fonts.svg?branch=master)](https://travis-ci.org/etienne-dldc/ts-fonts) [![](https://badgen.net/bundlephobia/minzip/ts-fonts)](https://bundlephobia.com/result?p=ts-fonts) [![codecov](https://codecov.io/gh/etienne-dldc/ts-fonts/branch/master/graph/badge.svg)](https://codecov.io/gh/etienne-dldc/ts-fonts)

Utils to uses fonts weights with Typescript

## Installation

```bash
yarn add ts-fonts
```

## Usage

```ts
import { Font } from 'ts-fonts';

const MyFont = Font.create('MyFont', {
  // for each valid weight
  400: {
    // specify paths to normal and italic woff and woff2
    normal: {
      woff: '/path-to-font-normal.woff',
      woff2: '/path-to-font-normal.woff2',
    },
    italic: {
      woff: '/path-to-font-italic.woff',
      woff2: '/path-to-font-italic.woff2',
    },
  },
  600: {
    // You can specify only one of normal and italic
    // If woff and woff2 have the same name you can use a string
    italic: '/path-to-font-semibold-italic',
  },
});

// Inject this in your document to register fonts
MyFont.fontFaces;

// you can now use the font

console.log(MyFont.styles.Regular.Normal);
// { fontFamily: 'MyFont', fontWeight: 400, fontStyle: 'normal' }

console.log(MyFont.styles.Regular.Italic);
// { fontFamily: 'MyFont', fontWeight: 400, fontStyle: 'italic' }

// if the weight has only one style get the object directly
console.log(MyFont.styles.SemiBold);
// { fontFamily: 'MyFont', fontWeight: 600, fontStyle: 'italic' }
```

## Font weight aliases

You can use any of the following name / number to acces a font.

**Note**: You have to use numbers to define the object passed to `Font.create`

```ts
export type FontWeight_100 = 100 | 'Thin';
export type FontWeight_200 = 200 | 'ExtraLight' | 'UltraLight';
export type FontWeight_300 = 300 | 'Light';
export type FontWeight_400 = 400 | 'Normal' | 'Book' | 'Regular';
export type FontWeight_500 = 500 | 'Medium';
export type FontWeight_600 = 600 | 'SemiBold' | 'DemiBold';
export type FontWeight_700 = 700 | 'Bold';
export type FontWeight_800 = 800 | 'ExtraBold' | 'UltraBold';
export type FontWeight_900 = 900 | 'Black' | 'Heavy';
```

## `Font.resolveFontWeight`

This function take any valid font weight name / number and return the corresponding font weight number.
