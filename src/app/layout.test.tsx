import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RootLayout, { metadata } from './layout';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'font-geist-sans' }),
  Geist_Mono: () => ({ variable: 'font-geist-mono' }),
}));

// RootLayout renders <html> and <body>, which cannot be mounted inside the jsdom container,
// so it is rendered to static markup and parsed into a standalone document. That document
// lives outside the test window, so plain DOM APIs are used instead of jest-dom matchers.
function renderLayout(children: React.ReactNode = <p>Page content</p>) {
  const markup = renderToStaticMarkup(<RootLayout>{children}</RootLayout>);
  return new DOMParser().parseFromString(markup, 'text/html');
}

describe('RootLayout', () => {
  it('exports the page metadata', () => {
    expect(metadata.title).toBe('Rick and Morty Explorer');
    expect(metadata.description).toBe('Explore the Rick and Morty universe');
  });

  it('applies the language and the font variables', () => {
    const doc = renderLayout();

    expect(doc.documentElement.getAttribute('lang')).toBe('en');
    expect(doc.body.classList.contains('font-geist-sans')).toBe(true);
    expect(doc.body.classList.contains('font-geist-mono')).toBe(true);
  });

  it('renders the children inside the main element', () => {
    const doc = renderLayout(<p>Page content</p>);

    expect(doc.querySelector('main')?.textContent).toBe('Page content');
  });

  it('renders the header navigation', () => {
    const doc = renderLayout();
    const links = Array.from(doc.querySelectorAll('header a'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/',
      'https://rickandmortyapi.com/documentation',
    ]);
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      '🧪 Rick & Morty App',
      'Characters',
      'API Docs',
    ]);
    expect(links[2].getAttribute('target')).toBe('_blank');
  });

  it('renders the footer with the API attribution', () => {
    const doc = renderLayout();
    const footer = doc.querySelector('footer');

    expect(footer?.textContent).toContain('Developed with Next.js, Tailwind CSS & ❤️');
    expect(footer?.querySelector('a')?.getAttribute('href')).toBe('https://rickandmortyapi.com');
  });
});
