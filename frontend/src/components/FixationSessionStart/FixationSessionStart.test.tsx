import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionStart from './FixationSessionStart';

describe('<FixationSessionStart />', () => {
  test('it should mount', () => {
    render(<FixationSessionStart />);
    
    const fixationSessionStart = screen.getByTestId('FixationSessionStart');

    expect(fixationSessionStart).toBeInTheDocument();
  });
});