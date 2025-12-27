
import { supabase } from "./supabase-client";

export async function getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
}

export async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function isAdmin() {
    // Client-side check not authoritative, use server API
    return false;
}

export async function resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
    });
    return { success: !error, error: error?.message };
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return {
        success: !error && !!data.session,
        session: data.session,
        error: error?.message,
        errorCode: error?.status
    };
}

export async function signUp(email: string, password: string, options?: { full_name?: string, phone?: string, role?: string }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: options
        }
    });

    return {
        success: !error && !!data.user,
        session: data.session,
        error: error?.message,
        errorCode: error?.code // 'email_verification_required' ? or we check data.session check
    };
}
