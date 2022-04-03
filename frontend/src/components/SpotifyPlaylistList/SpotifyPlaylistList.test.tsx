import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SpotifyPlaylistList from './SpotifyPlaylistList';

describe('<SpotifyPlaylistList />', () => {
  test('it should mount', () => {
    render(<SpotifyPlaylistList />);
    
    const spotifyPlaylistList = screen.getByTestId('SpotifyPlaylistList');

    expect(spotifyPlaylistList).toBeInTheDocument();
  });
});