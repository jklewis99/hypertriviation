import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationAnswerCard from './FixationAnswerCard';

describe('<FixationAnswerCard />', () => {
  test('it should mount', () => {
    render(<FixationAnswerCard />);
    
    const fixationAnswerCard = screen.getByTestId('FixationAnswerCard');

    expect(fixationAnswerCard).toBeInTheDocument();
  });
});