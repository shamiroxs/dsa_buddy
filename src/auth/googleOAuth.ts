/**
 * Google OAuth integration (frontend-only placeholder)
 * For MVP, this is a mock implementation
 */

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

let mockUser: User | null = null;

/**
 * Initialize Google OAuth (placeholder)
 */
export function initializeGoogleOAuth(_clientId: string): void {
  // Placeholder - in real implementation, would initialize Google OAuth
  console.log('Google OAuth initialized (mock)');
}

/**
 * Sign in with Google (placeholder)
 */
export async function signInWithGoogle(): Promise<User | null> {
  // Mock implementation - returns a fake user
  mockUser = {
    id: 'mock-user-123',
    name: 'Test User',
    email: 'test@example.com',
    picture: undefined,
  };
  
  // Save to localStorage for persistence
  localStorage.setItem('dsa-buddy-user', JSON.stringify(mockUser));
  
  return mockUser;
}

/**
 * Sign out
 */
export function signOut(): void {
  mockUser = null;
  localStorage.removeItem('dsa-buddy-user');
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  if (mockUser) {
    return mockUser;
  }
  
  // Try to load from localStorage
  const saved = localStorage.getItem('dsa-buddy-user');
  if (saved) {
    try {
      mockUser = JSON.parse(saved);
      return mockUser;
    } catch {
      return null;
    }
  }
  
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

