import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { LanguageContext } from '../common/LanguageContext';
import { UserContext } from '../common/UserContext';
import { MemoryRouter } from "react-router-dom";

describe('Login component', () => {
    it('should handle form submission', async () => {
        const language = 'en';
        const mockLanguageContextValue = {
            language,
        };

        const { getByLabelText, getByText } = render(
            <UserContext.Provider value={{}}>
                <LanguageContext.Provider value={mockLanguageContextValue}>
                    <MemoryRouter>
                        <Login />
                    </MemoryRouter>
                </LanguageContext.Provider>
            </UserContext.Provider>
        );

        // Simulate user input
        fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });

        // Verify input values
        expect(getByLabelText('Email').value).toBe('test@example.com');
        expect(getByLabelText('Password').value).toBe('password123');

        // Simulate form submission
        fireEvent.click(getByText('Login'));

        // wait for the mocked `signInWithEmailAndPassword` function to finish
        await waitFor(() => expect(getByText('Invalid email or password')).toBeInTheDocument());
    });
});
