import { Font } from '../src';

test('create a font', () => {
  const DemoFont = Font.create('Demo', {
    100: {
      normal: { woff: '/path-to-font-normal.woff', woff2: '/path-to-font-normal.woff2' },
      italic: {
        woff: '/path-to-font-normal-italic.woff',
        woff2: '/path-to-font-normal-italic.woff2',
      },
    },
    600: {
      italic: '/path-to-font-semibold-italic',
    },
    700: {
      normal: '/path-to-font-bold',
    },
  });

  expect(DemoFont.styles.Thin).toBe(DemoFont.styles[100]);

  expect(DemoFont.fontFaces).toMatchInlineSnapshot(`
    "@font-face {
      font-family: 'Demo';
      src: url('/path-to-font-normal-italic.woff') format('woff2'), url('/path-to-font-normal-italic.woff2') format('woff');
      font-weight: 100;
      font-style: italic;
    }

    @font-face {
      font-family: 'Demo';
      src: url('/path-to-font-normal.woff') format('woff2'), url('/path-to-font-normal.woff2') format('woff');
      font-weight: 100;
      font-style: normal;
    }

    @font-face {
      font-family: 'Demo';
      src: url('/path-to-font-semibold-italic.woff') format('woff2'), url('/path-to-font-semibold-italic.woff2') format('woff');
      font-weight: 600;
      font-style: italic;
    }

    @font-face {
      font-family: 'Demo';
      src: url('/path-to-font-bold.woff') format('woff2'), url('/path-to-font-bold.woff2') format('woff');
      font-weight: 700;
      font-style: normal;
    }"
`);

  expect(DemoFont.styles).toEqual({
    '100': {
      Italic: { fontFamily: 'Demo', fontStyle: 'italic', fontWeight: 100 },
      Normal: { fontFamily: 'Demo', fontWeight: 100 },
    },
    '700': { fontFamily: 'Demo', fontWeight: 700 },
    '600': {
      fontFamily: 'Demo',
      fontStyle: 'italic',
      fontWeight: 600,
    },
    Bold: { fontFamily: 'Demo', fontWeight: 700 },
    Thin: {
      Italic: { fontFamily: 'Demo', fontStyle: 'italic', fontWeight: 100 },
      Normal: { fontFamily: 'Demo', fontWeight: 100 },
    },
    DemiBold: {
      fontFamily: 'Demo',
      fontStyle: 'italic',
      fontWeight: 600,
    },
    SemiBold: {
      fontFamily: 'Demo',
      fontStyle: 'italic',
      fontWeight: 600,
    },
  });

  expect(DemoFont.fontFacesRules.length).toBe(4);

  expect(DemoFont.fontFacesRules).toEqual([
    {
      fontFamily: 'Demo',
      fontStyle: 'italic',
      fontWeight: 100,
      src: "url('/path-to-font-normal-italic.woff') format('woff2'), url('/path-to-font-normal-italic.woff2') format('woff')",
    },
    {
      fontFamily: 'Demo',
      fontStyle: 'normal',
      fontWeight: 100,
      src: "url('/path-to-font-normal.woff') format('woff2'), url('/path-to-font-normal.woff2') format('woff')",
    },
    {
      fontFamily: 'Demo',
      fontStyle: 'italic',
      fontWeight: 600,
      src: "url('/path-to-font-semibold-italic.woff') format('woff2'), url('/path-to-font-semibold-italic.woff2') format('woff')",
    },
    {
      fontFamily: 'Demo',
      fontStyle: 'normal',
      fontWeight: 700,
      src: "url('/path-to-font-bold.woff') format('woff2'), url('/path-to-font-bold.woff2') format('woff')",
    },
  ]);
});
