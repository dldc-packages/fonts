import { expect, test } from 'vitest';
import { Font } from '../src/mod';

test('create a font', () => {
  const DemoFont = Font.factory<string>()('Demo', {
    100: {
      normal: '/path-to-font-normal.woff',
      italic: '/path-to-font-normal-italic.woff',
    },
    600: {
      italic: '/path-to-font-semibold-italic',
    },
    700: {
      normal: '/path-to-font-bold',
    },
  });

  expect(DemoFont.styles.Thin).toBe(DemoFont.styles[100]);

  expect(DemoFont.rules).toEqual([
    {
      data: '/path-to-font-normal-italic.woff',
      fontFamily: 'Demo',
      fontStyle: 'italic',
      fontWeight: 100,
    },
    { data: '/path-to-font-normal.woff', fontFamily: 'Demo', fontStyle: 'normal', fontWeight: 100 },
    {
      data: '/path-to-font-semibold-italic',
      fontFamily: 'Demo',
      fontStyle: 'italic',
      fontWeight: 600,
    },
    { data: '/path-to-font-bold', fontFamily: 'Demo', fontStyle: 'normal', fontWeight: 700 },
  ]);

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

  expect(DemoFont.rules.length).toBe(4);
});
