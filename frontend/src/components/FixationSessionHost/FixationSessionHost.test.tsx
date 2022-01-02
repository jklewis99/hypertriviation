import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionHost from './FixationSessionHost';

describe('<FixationSessionHost />', () => {
  test('it should mount', () => {
    render(<FixationSessionHost />);
    
    const fixationSessionHost = screen.getByTestId('FixationSessionHost');

    expect(fixationSessionHost).toBeInTheDocument();
  });
});