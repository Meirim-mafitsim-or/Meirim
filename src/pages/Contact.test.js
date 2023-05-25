import { render, screen, fireEvent } from '@testing-library/react';
import Contact from './Contact';
import { LanguageContext } from '../common/LanguageContext';
import { UserContext } from '../common/UserContext';

describe('Contact component', () => {
    it('should render correctly', () => {
        const language = 'en';
        const mockLanguageContextValue = {
            language,
        };
        const { getByText, getByLabelText } = render(
            <UserContext.Provider value={{}}>
                <LanguageContext.Provider value={mockLanguageContextValue}>
                    <Contact />
                </LanguageContext.Provider>
            </UserContext.Provider>
        );

        // Fill in the form fields
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'Hello, this is a test message.' } });

        expect(screen.getByPlaceholderText('Full Name').value).toBe('John Doe');
        expect(screen.getByPlaceholderText('Email').value).toBe('john@example.com');
        expect(screen.getByPlaceholderText('Phone Number').value).toBe('1234567890');
        expect(screen.getByPlaceholderText('Message').value).toBe('Hello, this is a test message.');

        // Submit the form
        fireEvent.click(screen.getByText('Send'));

        // Assert that the form submission is successful
        expect(screen.getByText('Thank you for your message')).toBeInTheDocument();
    });
});

