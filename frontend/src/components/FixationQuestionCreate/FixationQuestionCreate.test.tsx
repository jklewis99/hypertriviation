import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationQuestionCreate from './FixationQuestionCreate';

describe('<FixationQuestionCreate />', () => {
  test('it should mount', () => {
    render(<FixationQuestionCreate />);
    
    const fixationQuestionCreate = screen.getByTestId('FixationQuestionCreate');

    expect(fixationQuestionCreate).toBeInTheDocument();
  });
});