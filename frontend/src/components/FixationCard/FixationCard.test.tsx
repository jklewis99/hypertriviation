import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationCard from './FixationCard';

describe('<SessionCard />', () => {
  test('it should mount', () => {
    render(<FixationCard />);
    
    const sessionCard = screen.getByTestId('SessionCard');

    expect(sessionCard).toBeInTheDocument();
  });
});