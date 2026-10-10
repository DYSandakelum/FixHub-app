import { supabase } from './supabase';

// ---- READ: Get all unverified providers (pending approval) ----
export async function getPendingProviders() {
    const { data, error } = await supabase
        .from('providers')
        .select('*, users(name, phone)')
        .eq('verified', false);

    if (error) {
        console.error('Error fetching pending providers:', error.message);
        return [];
    }
    return data;
}

// ---- UPDATE: Verify a provider ----
export async function verifyProvider(providerId: string) {
    const { data, error } = await supabase
        .from('providers')
        .update({ verified: true })
        .eq('id', providerId)
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error verifying provider:', error.message);
        return null;
    }
    return data;
}

// ---- DELETE/REJECT: Remove a provider application ----
export async function rejectProvider(providerId: string) {
    const { error } = await supabase
        .from('providers')
        .delete()
        .eq('id', providerId);

    if (error) {
        console.error('Error rejecting provider:', error.message);
        return false;
    }
    return true;
}

// ---- READ: Get dashboard stats ----
export async function getDashboardStats() {
    const [providersResult, bookingsResult, pendingResult] = await Promise.all([
        supabase.from('providers').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('providers').select('id', { count: 'exact', head: true }).eq('verified', false),
    ]);

    return {
        totalProviders: providersResult.count ?? 0,
        totalBookings: bookingsResult.count ?? 0,
        pendingVerifications: pendingResult.count ?? 0,
    };
}