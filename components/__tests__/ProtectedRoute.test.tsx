import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../ProtectedRoute';

// Mock du contexte d'authentification
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock du router Next.js
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should render loading state when loading is true', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ 
      user: { id: '1', email: 'test@example.com' }, 
      loading: false 
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
  });

  it('should not redirect while loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockPush).not.toHaveBeenCalled();
  });
});
