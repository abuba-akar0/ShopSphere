import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock component that uses the auth context
const TestComponent = () => {
    const { user, isAuthenticated, login, logout, register, loading, error } = useAuth();
    
    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {isAuthenticated ? (
                <>
                    <p>Logged in as: {user?.email}</p>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => login('test@example.com', 'password123')}>Login</button>
                    <button onClick={() => register('test@example.com', 'password123')}>Register</button>
                </>
            )}
        </div>
    );
};

// Mock the API calls
jest.mock('../api/auth', () => ({
    loginUser: jest.fn(),
    registerUser: jest.fn(),
    logoutUser: jest.fn(),
}));

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    test('shows loading state', async () => {
        // You'll need to adjust this based on your actual implementation
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        
        // Trigger login which should set loading to true
        await act(async () => {
            userEvent.click(screen.getByText(/Login/i));
        });
        
        // This expects loading to be shown during authentication
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    // Add more tests for login, logout, register functionality
});