import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayerFixationJoin from './PlayerFixationJoin';

describe('<PlayerFixationJoin />', () => {
  test('it should mount', () => {
    render(<PlayerFixationJoin />);
    
    const playerFixationJoin = screen.getByTestId('PlayerFixationJoin');

    expect(playerFixationJoin).toBeInTheDocument();
  });
});