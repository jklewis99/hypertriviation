import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionEnd from './FixationSessionEnd';

describe('<FixationSessionEnd />', () => {
  test('it should mount', () => {
    render(<FixationSessionEnd />);
    
    const fixationSessionEnd = screen.getByTestId('FixationSessionEnd');

    expect(fixationSessionEnd).toBeInTheDocument();
  });
});