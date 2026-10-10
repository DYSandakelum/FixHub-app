import { useEffect, useState } from 'react';
import i18n, { LangKey } from './i18n';

type SettingsState = {
    providerName: string;
    country: string;
    serviceCategory: string;
    serviceArea: string;
    autoAccept: boolean;
    newRequestAlerts: boolean;
    vacationMode: boolean;
    appLanguage: LangKey;
    activeJobDetails?: any;
    baseFee: number;
};

type Listener = (state: SettingsState) => void;

class SettingsStore {
    private state: SettingsState = {
        providerName: 'Judith Glavour',
        country: 'Sri Lanka', // Default to Sri Lanka as requested by user's test flow
        serviceCategory: 'Plumbing',
        serviceArea: 'Colombo District',
        autoAccept: false,
        newRequestAlerts: true,
        vacationMode: false,
        appLanguage: 'English',
        activeJobDetails: null,
        baseFee: 2500
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

    setProviderName(providerName: string) {
        this.state = { ...this.state, providerName };
        this.notify();
    }

    setServiceCategory(serviceCategory: string) {
        this.state = { ...this.state, serviceCategory };
        this.notify();
    }

    setServiceArea(serviceArea: string) {
        this.state = { ...this.state, serviceArea };
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

    setVacationMode(vacationMode: boolean) {
        this.state = { ...this.state, vacationMode };
        this.notify();
    }

    setActiveJobDetails(job: any) {
        this.state = { ...this.state, activeJobDetails: job };
        this.notify();
    }

    setBaseFee(baseFee: number) {
        this.state = { ...this.state, baseFee };
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
