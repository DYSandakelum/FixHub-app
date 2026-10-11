import { supabase } from './supabase';

/**
 * Format provider role and profession for clear display
 */
export function formatProviderRole(serviceType?: string, role?: string): string {
    if (!serviceType) {
        return role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'Service Provider';
    }

    const lower = serviceType.toLowerCase();
    if (lower.includes('electric')) return 'Electrician';
    if (lower.includes('plumb')) return 'Plumber';
    if (lower.includes('clean')) return 'Cleaner';
    if (lower.includes('ac') || lower.includes('hvac')) return 'AC Technician';
    if (lower.includes('paint')) return 'Painter';
    if (lower.includes('carpent')) return 'Carpenter';
    if (lower.includes('appliance')) return 'Appliance Specialist';

    return `${serviceType} Specialist`;
}

/**
 * Extract 1-2 letter uppercase initials from name
 */
export function getProviderInitials(name?: string): string {
    if (!name || !name.trim()) return 'SP';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ---- READ: Get all providers (for Search & Filter Results screen) ----
export async function getProviders() {
    const { data, error } = await supabase
        .from('providers')
        .select('*, users(name, role, phone, avatar_url)');

    if (error) {
        console.error('Error fetching providers:', error.message);
        return [];
    }
    return data;
}

// ---- READ: Get a single provider's full profile (for Provider Profile screen) ----
export async function getProviderById(providerId: string) {
    const { data, error } = await supabase
        .from('providers')
        .select('*, users(name, role, phone, avatar_url)')
        .eq('id', providerId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching provider:', error.message);
        return null;
    }
    return data;
}

// ---- CREATE: Make a new booking (for Booking screen) ----
export async function createBooking({
    customerId,
    providerId,
    serviceDate,
    serviceTime,
    price,
    status = 'Pending',
}: {
    customerId: string;
    providerId: string;
    serviceDate: string;
    serviceTime: string;
    price: number;
    status?: string;
}) {
    const { data, error } = await supabase
        .from('bookings')
        .insert({
            customer_id: customerId,
            provider_id: providerId,
            service_date: serviceDate,
            service_time: serviceTime,
            price: price,
            status: status,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating booking:', error.message);
        return null;
    }
    return data;
}

// ---- READ: Get bookings for a provider ----
export async function getProviderBookings(providerId?: string) {
    let query = supabase
        .from('bookings')
        .select('*, customer:users!customer_id(name, phone)')
        .order('created_at', { ascending: false });

    if (providerId) {
        query = query.eq('provider_id', providerId);
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching provider bookings:', error.message);
        return [];
    }
    return data || [];
}

// ---- UPDATE: Update booking status (e.g. Confirmed, In Progress, Completed, Cancelled) ----
export async function updateBookingStatus(bookingId: string, status: string) {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error updating booking status:', error.message);
        return null;
    }
    return data;
}

// ---- UPDATE: Change a booking's date/time before confirmation ----
export async function updateBooking(bookingId: string, updates: { service_date?: string; service_time?: string }) {
    const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error updating booking:', error.message);
        return null;
    }
    return data;
}

// ---- DELETE: Cancel a pending booking ----
export async function cancelBooking(bookingId: string) {
    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

    if (error) {
        console.error('Error cancelling booking:', error.message);
        return false;
    }
    return true;
}

// ---- READ: Search/filter providers by service type and max price ----
export async function searchProviders({
    serviceType,
    maxPrice,
}: {
    serviceType?: string;
    maxPrice?: number;
}) {
    let query = supabase
        .from('providers')
        .select('*, users(name, role, phone, avatar_url)');


    if (serviceType) {
        query = query.eq('service_type', serviceType);
    }
    if (maxPrice) {
        query = query.lte('rate', maxPrice);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error searching providers:', error.message);
        return [];
    }
    return data;
}

// ---- READ: Get all bookings for a specific customer ----
export async function getCustomerBookings(customerId: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, providers(service_type, users(name, role, phone, avatar_url))')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching customer bookings:', error.message);
        return [];
    }
    return data;
}