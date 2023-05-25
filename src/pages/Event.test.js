import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Event from './Event';
import { LanguageContext } from '../common/LanguageContext';
import { UserContext } from '../common/UserContext';

// Mock the LanguageContext value
const mockLanguageContextValue = {
  language: 'en',
};

describe('FormExample component', () => {
  it('should render form fields correctly', () => {
    const { getByLabelText, getByText } = render(
      <UserContext.Provider value={{}}>
        <LanguageContext.Provider value={mockLanguageContextValue}>
          <Event />
        </LanguageContext.Provider>
      </UserContext.Provider>

    );

    // Assert that the form fields are rendered correctly
    const firstNameField = getByLabelText('First Name');
    const lastNameField = getByLabelText('Last Name');
    const cityField = getByLabelText('City');
    const streetField = getByLabelText('Street');
    const houseNumberField = getByLabelText('House Number');
    const apartmentNumberField = getByLabelText('Apartment Number');
    const phoneNumberField = getByLabelText('Phone Number');
    const emailField = getByLabelText('Email');
    const specialCommentField = getByLabelText('Specials Comments');

    expect(firstNameField).toBeInTheDocument();
    expect(lastNameField).toBeInTheDocument();
    expect(cityField).toBeInTheDocument();
    expect(streetField).toBeInTheDocument();
    expect(houseNumberField).toBeInTheDocument();
    expect(apartmentNumberField).toBeInTheDocument();
    expect(phoneNumberField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(specialCommentField).toBeInTheDocument();

    fireEvent.change(firstNameField, { target: { value: 'John' } });
    fireEvent.change(lastNameField, { target: { value: 'Doe' } });
    fireEvent.change(cityField, { target: { value: 'New York' } });
    fireEvent.change(streetField, { target: { value: 'Main Street' } });
    fireEvent.change(houseNumberField, { target: { value: '123' } });
    fireEvent.change(apartmentNumberField, { target: { value: '456' } });
    fireEvent.change(phoneNumberField, { target: { value: '555-1234' } });
    fireEvent.change(emailField, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(specialCommentField, { target: { value: 'Test comment' } });

    // Verify input values
    expect(firstNameField.value).toBe('John');
    expect(lastNameField.value).toBe('Doe');
    expect(cityField.value).toBe('New York');
    expect(streetField.value).toBe('Main Street');
    expect(houseNumberField.value).toBe('123');
    expect(apartmentNumberField.value).toBe('456');
    expect(phoneNumberField.value).toBe('555-1234');
    expect(emailField.value).toBe('john.doe@example.com');
    expect(specialCommentField.value).toBe('Test comment');

    // Test form submission
    fireEvent.click(getByText('Send'));

    // Assert that form submission is handled correctly
    expect(getByText('Thank you for your registration')).toBeInTheDocument();


  });
});
