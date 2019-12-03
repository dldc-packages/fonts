import { Font } from '../src';

test('create a font', () => {
  const font = Font.create('Demo', {
    100: {
      normal: { woff: '', woff2: '' },
      italic: { woff: '', woff2: '' },
    },
    700: {
      normal: { woff: '', woff2: '' },
    },
  });

  expect(font.styles).toEqual({
    '100': {
      Italic: { fontFamily: 'Demo', fontStyle: 'italic', fontWeight: 100 },
      Normal: { fontFamily: 'Demo', fontWeight: 100 },
    },
    '700': { fontFamily: 'Demo', fontWeight: 700 },
    Bold: { fontFamily: 'Demo', fontWeight: 700 },
    Thin: {
      Italic: { fontFamily: 'Demo', fontStyle: 'italic', fontWeight: 100 },
      Normal: { fontFamily: 'Demo', fontWeight: 100 },
    },
  });
});
