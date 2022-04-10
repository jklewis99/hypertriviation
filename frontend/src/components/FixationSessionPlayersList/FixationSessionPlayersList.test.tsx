import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationSessionPlayersList from './FixationSessionPlayersList';

describe('<FixationSessionPlayersList />', () => {
  test('it should mount', () => {
    render(<FixationSessionPlayersList />);
    
    const fixationSessionPlayersList = screen.getByTestId('FixationSessionPlayersList');

    expect(fixationSessionPlayersList).toBeInTheDocument();
  });
});