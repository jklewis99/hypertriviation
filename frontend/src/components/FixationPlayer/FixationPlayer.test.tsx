import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationPlayer from './FixationPlayer';

describe('<PlayerFixation />', () => {
  test('it should mount', () => {
    render(<FixationPlayer />);
    
    const playerFixation = screen.getByTestId('PlayerFixation');

    expect(playerFixation).toBeInTheDocument();
  });
});