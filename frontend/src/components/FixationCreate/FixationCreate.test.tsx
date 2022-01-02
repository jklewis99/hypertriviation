import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationCreate from './FixationCreate';

describe('<FixationCreate />', () => {
  test('it should mount', () => {
    render(<FixationCreate />);
    
    const fixationCreate = screen.getByTestId('FixationCreate');

    expect(fixationCreate).toBeInTheDocument();
  });
});