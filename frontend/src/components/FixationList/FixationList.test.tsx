import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FixationList from './FixationList';

describe('<StartSession />', () => {
  test('it should mount', () => {
    render(<FixationList />);
    
    const startSession = screen.getByTestId('StartSession');

    expect(startSession).toBeInTheDocument();
  });
});