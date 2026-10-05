import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from './loading';

describe('Loading', () => {
  it('renders a title placeholder and eight card skeletons', () => {
    const { container } = render(<Loading />);

    // 1 title placeholder + 8 card skeletons
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(9);
    expect(container.querySelectorAll('.grid > .animate-pulse')).toHaveLength(8);
  });
});
