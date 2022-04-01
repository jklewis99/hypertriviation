import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationPlayerJoin from './FixationPlayerJoin';

describe('<PlayerFixationJoin />', () => {
  test('it should mount', () => {
    render(<FixationPlayerJoin />);
    
    const playerFixationJoin = screen.getByTestId('PlayerFixationJoin');

    expect(playerFixationJoin).toBeInTheDocument();
  });
});