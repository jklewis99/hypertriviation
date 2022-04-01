import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationPlayerQuestion from './FixationPlayerQuestion';

describe('<FixationPlayerQuestion />', () => {
  test('it should mount', () => {
    render(<FixationPlayerQuestion />);
    
    const fixationPlayerQuestion = screen.getByTestId('FixationPlayerQuestion');

    expect(fixationPlayerQuestion).toBeInTheDocument();
  });
});