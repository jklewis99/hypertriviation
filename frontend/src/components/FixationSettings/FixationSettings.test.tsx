import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSettings from './FixationSettings';

describe('<FixationSettings />', () => {
  test('it should mount', () => {
    render(<FixationSettings />);
    
    const fixationSettings = screen.getByTestId('FixationSettings');

    expect(fixationSettings).toBeInTheDocument();
  });
});