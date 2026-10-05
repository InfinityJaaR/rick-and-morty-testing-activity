import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('shows the current page and the total number of pages', () => {
    render(<Pagination currentPage={3} totalPages={42} />);

    expect(screen.getByText('Page 3 of 42')).toBeInTheDocument();
  });

  it('disables "Previous" and links "Next" on the first page', () => {
    render(<Pagination currentPage={1} totalPages={42} />);

    expect(screen.queryByRole('link', { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.getByText(/previous/i)).toHaveClass('cursor-not-allowed');
    expect(screen.getByRole('link', { name: /next/i })).toHaveAttribute('href', '/?page=2');
  });

  it('links both directions on a middle page', () => {
    render(<Pagination currentPage={5} totalPages={42} />);

    expect(screen.getByRole('link', { name: /previous/i })).toHaveAttribute('href', '/?page=4');
    expect(screen.getByRole('link', { name: /next/i })).toHaveAttribute('href', '/?page=6');
  });

  it('links "Previous" and disables "Next" on the last page', () => {
    render(<Pagination currentPage={42} totalPages={42} />);

    expect(screen.getByRole('link', { name: /previous/i })).toHaveAttribute('href', '/?page=41');
    expect(screen.queryByRole('link', { name: /next/i })).not.toBeInTheDocument();
    expect(screen.getByText(/next/i)).toHaveClass('cursor-not-allowed');
  });

  it('disables both directions when there is a single page', () => {
    render(<Pagination currentPage={1} totalPages={1} />);

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
