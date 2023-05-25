import React from 'react';
import strings from '../static/Strings.json';
import { render } from '@testing-library/react';
import { LanguageContext } from '../common/LanguageContext';
import { MemoryRouter } from 'react-router-dom';
import About from './About';

// Test the About component and the LanguageContext

describe('About component', () => {
    it('should render correctly', () => {
        // Mock the LanguageContext value
        let language = 'en';
        const mockChangeLanguage = jest.fn();
        const mockLanguageContextValue = {
            language,
            changeLanguage: mockChangeLanguage,
        };

        const { getByText } = render(

            <LanguageContext.Provider value={mockLanguageContextValue}>
                <MemoryRouter>
                    <About />
                </MemoryRouter>
            </LanguageContext.Provider>
        );

        // Assert that the title and text are rendered
        const titleElement = getByText(strings.about_title[language]);
        const textElement = getByText(strings.about_text[language]);
        expect(titleElement).toBeInTheDocument();
        expect(textElement).toBeInTheDocument();

        //change language to hebrew and assert that the title and text are rendered in hebrew
        language = 'he';
        const updatedLanguageContextValue = {
            language,
            changeLanguage: mockChangeLanguage,
        };
        render(
            <LanguageContext.Provider value={updatedLanguageContextValue}>
                <MemoryRouter>
                    <About />
                </MemoryRouter>
            </LanguageContext.Provider>
        );

        // Assert that the title and text are rendered in the updated language (he)
        const titleElementHe = getByText(strings.about_title[language]);
        const textElementHe = getByText(strings.about_text[language]);
        expect(titleElementHe).toBeInTheDocument();
        expect(textElementHe).toBeInTheDocument();

    });
}
);

