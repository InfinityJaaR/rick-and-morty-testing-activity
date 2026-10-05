import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import type { ImgHTMLAttributes } from 'react';

// next/image depends on Next's image loader; in unit tests a plain <img> is enough.
vi.mock('next/image', () => ({
  default: ({ src, alt, className, sizes }: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} sizes={sizes} />
  ),
}));

afterEach(() => {
  cleanup();
});
