import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserForm from './UserForm';

describe('<UserForm />', () => {
  test('it should mount', () => {
    render(<UserForm />);
    
    const userForm = screen.getByTestId('UserForm');

    expect(userForm).toBeInTheDocument();
  });
});