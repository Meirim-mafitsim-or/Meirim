import React from 'react';
import { render } from '@testing-library/react';
import { LanguageContext } from './LanguageContext';
import EventCard from './EventCard';
import { UserContext } from '../common/UserContext';
import { BrowserRouter } from "react-router-dom";

describe('EventCard component', () => {
    it('should render correctly', () => {
        // Mock the LanguageContext value
        const language = 'en';
        const mockLanguageContextValue = {
            language,
        };

        // Mock the props for the EventCard
        const event = {
            settlement_en: 'Hashmonaim',
            date: { seconds: 0 }, 
            image: 'https://firebasestorage.googleapis.com/v0/b/meirim-b3c4f.appspot.com/o/settlements%2Fpetah_tiqwa.jpg?alt=media&token=9aeb3d03-92e1-4cba-9b93-182f8a97220b',
        };

        const { getByText } = render(
            <UserContext.Provider value={{}}>
                <LanguageContext.Provider value={mockLanguageContextValue}>
                    <BrowserRouter>
                        <EventCard event={event} />
                    </BrowserRouter>
                </LanguageContext.Provider>
            </UserContext.Provider>
        );

        // Assert that the settlement and date are rendered correctly
        expect(getByText('Hashmonaim')).toBeInTheDocument();
        expect(getByText('Thu, 01 Jan 1970 00:00:00 GMT')).toBeInTheDocument(); // Replace with the expected date string

    });
});
