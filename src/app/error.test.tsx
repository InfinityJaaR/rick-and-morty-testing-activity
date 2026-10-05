import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import ErrorPage from './error';

let consoleErrorSpy: MockInstance<typeof console.error>;

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Error boundary', () => {
  it('shows a friendly error message', () => {
    render(<ErrorPage error={new Error('Boom')} reset={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Something went wrong!' })).toBeInTheDocument();
    expect(screen.getByText(/couldn't load the characters/i)).toBeInTheDocument();
  });

  it('logs the error to the console', () => {
    const error = new Error('Boom');

    render(<ErrorPage error={error} reset={vi.fn()} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });

  it('calls reset when the user clicks "Try again"', async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<ErrorPage error={new Error('Boom')} reset={reset} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
