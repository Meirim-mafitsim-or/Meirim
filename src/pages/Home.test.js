import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';
import { LanguageContext } from '../common/LanguageContext';

describe('Home component', () => {
  it('renders correctly', () => {
    const language = 'en';
    const mockLanguageContextValue = {
      language,
    };

    const { getByText } = render(
      <LanguageContext.Provider value={mockLanguageContextValue}>
        <Home />
      </LanguageContext.Provider>
    );

    expect(getByText('Was there?')).toBeInTheDocument();
    expect(getByText('Slide Picture')).toBeInTheDocument();
  });
});
