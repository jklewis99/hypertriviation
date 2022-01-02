import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationView from './FixationView';

describe('<FixationView />', () => {
  test('it should mount', () => {
    render(<FixationView />);
    
    const fixationStart = screen.getByTestId('FixationView');

    expect(fixationStart).toBeInTheDocument();
  });
});