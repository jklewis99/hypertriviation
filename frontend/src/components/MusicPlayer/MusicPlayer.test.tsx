import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MusicPlayer from './MusicPlayer';

describe('<MusicPlayer />', () => {
  test('it should mount', () => {
    render(<MusicPlayer />);
    
    const musicPlayer = screen.getByTestId('MusicPlayer');

    expect(musicPlayer).toBeInTheDocument();
  });
});