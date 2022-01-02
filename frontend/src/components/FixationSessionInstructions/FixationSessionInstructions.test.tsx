import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionInstructions from './FixationSessionInstructions';

describe('<FixationSessionInstructions />', () => {
  test('it should mount', () => {
    render(<FixationSessionInstructions />);
    
    const fixationSessionInstructions = screen.getByTestId('FixationSessionInstructions');

    expect(fixationSessionInstructions).toBeInTheDocument();
  });
});