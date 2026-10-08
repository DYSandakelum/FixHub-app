import { useEffect, useState } from 'react';
import i18n, { LangKey } from './i18n';

type SettingsState = {
    country: string;
    serviceCategory: string;
    autoAccept: boolean;
    newRequestAlerts: boolean;
    appLanguage: LangKey;
};

type Listener = (state: SettingsState) => void;

class SettingsStore {
    private state: SettingsState = {
        country: 'Sri Lanka', // Default to Sri Lanka as requested by user's test flow
        serviceCategory: 'Plumbing',
        autoAccept: false,
        newRequestAlerts: true,
        appLanguage: 'English'
    };
    private listeners: Set<Listener> = new Set();

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }

    private notify() {
        this.listeners.forEach((listener) => listener(this.state));
    }

    setCountry(country: string) {
        this.state = { ...this.state, country };
        this.notify();
    }

    setServiceCategory(serviceCategory: string) {
        this.state = { ...this.state, serviceCategory };
        this.notify();
    }

    setAutoAccept(autoAccept: boolean) {
        this.state = { ...this.state, autoAccept };
        this.notify();
    }

    setNewRequestAlerts(newRequestAlerts: boolean) {
        this.state = { ...this.state, newRequestAlerts };
        this.notify();
    }

    setAppLanguage(lang: LangKey) {
        this.state = { ...this.state, appLanguage: lang };
        i18n.changeLanguage(lang);
        this.notify();
    }

    get() {
        return this.state;
    }
}

export const settingsStore = new SettingsStore();

export function useSettings() {
    const [state, setState] = useState(settingsStore.get());

    useEffect(() => {
        const unsubscribe = settingsStore.subscribe(setState);
        return () => unsubscribe();
    }, []);

    return state;
}

export function useCurrency() {
    const { country } = useSettings();

    // Check if the current country is Sri Lanka
    const isLKR = country.trim().toLowerCase() === 'sri lanka';

    // Default to USD for all other countries, LKR (Rs) for Sri Lanka
    const currencySymbol = isLKR ? 'Rs ' : '$';

    const formatCurrency = (amount: number | string) => {
        return `${currencySymbol}${amount}`;
    };

    return {
        country,
        currencySymbol,
        formatCurrency,
    };
}


export const getRoleNameString = (category: string) => {
    switch (category) {
        case 'Plumbing': return 'Plumber';
        case 'Electrical': return 'Electrician';
        case 'Cleaning': return 'Cleaner';
        default: return category;
    }
}
