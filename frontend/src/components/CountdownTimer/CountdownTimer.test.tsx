import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CountdownTimer from './CountdownTimer';

describe('<CountdownTimer />', () => {
  test('it should mount', () => {
    render(<CountdownTimer />);
    
    const countdownTimer = screen.getByTestId('CountdownTimer');

    expect(countdownTimer).toBeInTheDocument();
  });
});