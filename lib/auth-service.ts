import { supabase } from "./supabase-client";
import { AuthError, Session, User } from "@supabase/supabase-js";

export interface AuthResult {
  success: boolean;
  error?: string;
  errorCode?: string;
  session?: Session | null;
  user?: User | null;
}

export interface UserMetadata {
  full_name?: string;
  phone?: string;
  role?: 'student' | 'business' | 'admin';
}

// Unified sign-in function
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: getReadableErrorMessage(error),
        errorCode: error.status?.toString() || 'unknown',
      };
    }

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
      errorCode: 'network_error',
    };
  }
}

// Unified sign-up function
export async function signUp(
  email: string,
  password: string,
  metadata?: UserMetadata
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
        emailRedirectTo: `${window.location.origin}/profile`,
      },
    });

    if (error) {
      return {
        success: false,
        error: getReadableErrorMessage(error),
        errorCode: error.status?.toString() || 'unknown',
      };
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
      return {
        success: true,
        user: data.user,
        session: null,
        error: 'Please check your email to verify your account.',
        errorCode: 'email_verification_required',
      };
    }

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
      errorCode: 'network_error',
    };
  }
}

// Unified sign-out function
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: 'Failed to sign out. Please try again.',
        errorCode: error.status?.toString() || 'unknown',
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Network error. Please try again.',
      errorCode: 'network_error',
    };
  }
}

// Get current session
export async function getCurrentSession(): Promise<{ session: Session | null; user: User | null }> {
  try {
    const { data } = await supabase.auth.getSession();
    return {
      session: data.session,
      user: data.session?.user || null,
    };
  } catch (error) {
    console.error('Failed to get current session:', error);
    return {
      session: null,
      user: null,
    };
  }
}

// Refresh session
export async function refreshSession(): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      return {
        success: false,
        error: 'Session expired. Please log in again.',
        errorCode: 'session_expired',
      };
    }

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Failed to refresh session.',
      errorCode: 'refresh_failed',
    };
  }
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) return false;
    
    // Check user metadata for admin role
    const role = user.user_metadata?.role || user.app_metadata?.role;
    return role === 'admin';
  } catch (error) {
    console.error('Failed to check admin status:', error);
    return false;
  }
}

// Get user role
export async function getUserRole(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    
    if (!user) return null;
    
    return user.user_metadata?.role || user.app_metadata?.role || 'user';
  } catch (error) {
    console.error('Failed to get user role:', error);
    return null;
  }
}

// Reset password request
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: getReadableErrorMessage(error),
        errorCode: error.status?.toString() || 'unknown',
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Network error. Please try again.',
      errorCode: 'network_error',
    };
  }
}

// Update password
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: getReadableErrorMessage(error),
        errorCode: error.status?.toString() || 'unknown',
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Failed to update password.',
      errorCode: 'update_failed',
    };
  }
}

// Resend verification email
export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      return {
        success: false,
        error: getReadableErrorMessage(error),
        errorCode: error.status?.toString() || 'unknown',
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Failed to resend verification email.',
      errorCode: 'resend_failed',
    };
  }
}

// Helper function to convert Supabase errors to readable messages
function getReadableErrorMessage(error: AuthError): string {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.includes('email not confirmed')) {
    return 'Please verify your email address before logging in. Check your inbox for the verification link.';
  }
  
  if (message.includes('user not found')) {
    return 'No account found with this email address.';
  }
  
  if (message.includes('password')) {
    return 'Password must be at least 6 characters long.';
  }
  
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  
  if (message.includes('network')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (message.includes('already registered') || message.includes('user already registered')) {
    return 'An account with this email already exists. Please log in instead.';
  }

  // Return the original message if no specific case matches
  return error.message || 'An unexpected error occurred. Please try again.';
}

// Set up auth state change listener
export function onAuthStateChange(callback: (session: Session | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => {
    subscription.unsubscribe();
  };
}
