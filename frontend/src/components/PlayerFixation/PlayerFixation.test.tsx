import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayerFixation from './PlayerFixation';

describe('<PlayerFixation />', () => {
  test('it should mount', () => {
    render(<PlayerFixation />);
    
    const playerFixation = screen.getByTestId('PlayerFixation');

    expect(playerFixation).toBeInTheDocument();
  });
});