import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SpotifyPlaylistItem from './SpotifyPlaylistItem';

describe('<SpotifyPlaylistItem />', () => {
  test('it should mount', () => {
    render(<SpotifyPlaylistItem />);
    
    const spotifyPlaylistItem = screen.getByTestId('SpotifyPlaylistItem');

    expect(spotifyPlaylistItem).toBeInTheDocument();
  });
});