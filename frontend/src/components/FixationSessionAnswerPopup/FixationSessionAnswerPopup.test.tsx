import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionAnswerPopup from './FixationSessionAnswerPopup';

describe('<FixationSessionAnswerPopup />', () => {
  test('it should mount', () => {
    render(<FixationSessionAnswerPopup />);
    
    const fixationSessionAnswerPopup = screen.getByTestId('FixationSessionAnswerPopup');

    expect(fixationSessionAnswerPopup).toBeInTheDocument();
  });
});