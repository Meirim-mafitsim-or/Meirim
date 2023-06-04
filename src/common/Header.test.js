import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import { UserContext } from './UserContext';
import Header from './Header';

// Test the Header component

describe('Header component', () => {
    it('should render correctly', () => {
        // Mock the LanguageContext value
        let language = 'en'; // Replace with the desired language value
        const mockChangeLanguage = jest.fn();
        const mockLanguageContextValue = {
            language,
            changeLanguage: mockChangeLanguage,
        };

        const { getByAltText, getByText } = render(
            <UserContext.Provider value={{}}>
            <LanguageContext.Provider value={mockLanguageContextValue}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </LanguageContext.Provider>
            </UserContext.Provider>
        );

        // Assert that the logo is rendered
        const logoElement = getByAltText('logo');
        expect(logoElement).toBeInTheDocument();
        expect(logoElement.getAttribute('src')).toBe('logo.png');

        // Assert that the menu items are rendered
        const homeLink = getByText('Home');
        const contactLink = getByText('Contact');
        const aboutLink = getByText('About');
        expect(homeLink.getAttribute('href')).toBe('/');
        expect(contactLink.getAttribute('href')).toBe('/Contact');
        expect(aboutLink.getAttribute('href')).toBe('/About');
    });
});

//test the language dropdown
describe('Language dropdown', () => {
    it('should render correctly', () => {
        // Mock the LanguageContext value
        let language = 'en';
        const mockChangeLanguage = jest.fn();
        const mockLanguageContextValue = {
            language,
            changeLanguage: mockChangeLanguage,
        };

        const { getByText } = render(
            <UserContext.Provider value={{}}>
            <LanguageContext.Provider value={mockLanguageContextValue}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </LanguageContext.Provider>
            </UserContext.Provider>
        );

        // Assert that the language dropdown is rendered
        const languageDropdown = getByText('Language');
        expect(getByText('Language')).toBeInTheDocument();

        // Simulate changing the language
        fireEvent.click(languageDropdown);
        fireEvent.click(getByText('עברית'));

        // Assert that the changeLanguage function is called with the correct language code
        expect(mockChangeLanguage).toHaveBeenCalledWith('he');
    });
}
);

