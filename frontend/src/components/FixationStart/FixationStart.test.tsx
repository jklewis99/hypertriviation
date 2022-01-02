import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationStart from './FixationStart';

describe('<FixationStart />', () => {
  test('it should mount', () => {
    render(<FixationStart />);
    
    const fixationStart = screen.getByTestId('FixationStart');

    expect(fixationStart).toBeInTheDocument();
  });
});