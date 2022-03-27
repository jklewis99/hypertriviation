import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionQuestion from './FixationSessionQuestion';

describe('<FixationSessionQuestion />', () => {
  test('it should mount', () => {
    render(<FixationSessionQuestion />);
    
    const fixationSessionQuestion = screen.getByTestId('FixationSessionQuestion');

    expect(fixationSessionQuestion).toBeInTheDocument();
  });
});