import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionSettings from './FixationSessionSettings';

describe('<FixationSessionSettings />', () => {
  test('it should mount', () => {
    render(<FixationSessionSettings />);
    
    const fixationSessionSettings = screen.getByTestId('FixationSessionSettings');

    expect(fixationSessionSettings).toBeInTheDocument();
  });
});