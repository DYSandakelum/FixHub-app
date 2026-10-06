import { supabase } from './supabase';

// ---- READ: Get all providers (for Search & Filter Results screen) ----
export async function getProviders() {
    const { data, error } = await supabase
        .from('providers')
        .select('*, users(name)')
        .eq('verified', true);

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
        .select('*, users(name, phone)')
        .eq('id', providerId)
        .single();

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
}: {
    customerId: string;
    providerId: string;
    serviceDate: string;
    serviceTime: string;
    price: number;
}) {
    const { data, error } = await supabase
        .from('bookings')
        .insert({
            customer_id: customerId,
            provider_id: providerId,
            service_date: serviceDate,
            service_time: serviceTime,
            price: price,
            status: 'Confirmed',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating booking:', error.message);
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
        .single();

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
        .select('*, users(name)')
        .eq('verified', true);

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