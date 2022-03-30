import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionAnswer from './FixationSessionAnswer';

describe('<FixationSessionAnswer />', () => {
  test('it should mount', () => {
    render(<FixationSessionAnswer />);
    
    const fixationSessionAnswer = screen.getByTestId('FixationSessionAnswer');

    expect(fixationSessionAnswer).toBeInTheDocument();
  });
});