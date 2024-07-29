import React from 'react';
import { render, screen } from '@testing-library/react';
import ClientsInscrits from './ClientsInscrits';

test('renders the correct number of clients', () => {
    const nbClients = 5;
    render(<ClientsInscrits nbClients={nbClients} />);
    const element = screen.getByText(`Nombre de clients inscrits : ${nbClients}`);
    expect(element).toBeInTheDocument();
});
test('renders correctly with zero clients', () => {
    const nbClients = 0;
    render(<ClientsInscrits nbClients={nbClients} />);
    const element = screen.getByText(`Nombre de clients inscrits : ${nbClients}`);
    expect(element).toBeInTheDocument();
});
