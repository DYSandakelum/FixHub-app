import { useEffect, useState } from 'react';

export type JobRequest = {
    id: string;
    customerName: string;
    location: string;
    time: string;
    serviceType: string;
    initial: string;
    isNext: boolean;
    date: string;
};

const defaultDate = '2026-10-19'; // Or dynamically set to today if preferred

// Shared initial mock data
let globalJobs: JobRequest[] = [
    {
        id: '1',
        customerName: 'Dunil K.',
        location: 'Maharagama',
        time: '11:30 AM',
        serviceType: 'Pipe leak',
        initial: 'DK',
        isNext: true,
        date: defaultDate,
    },
    {
        id: '2',
        customerName: 'Sam C.',
        location: 'Colombo 7',
        time: '02:00 PM',
        serviceType: 'AC Maintenance',
        initial: 'SC',
        isNext: false,
        date: defaultDate,
    },
    {
        id: '3',
        customerName: 'Nishantha R.',
        location: 'Nugegoda',
        time: '04:00 PM',
        serviceType: 'Electrical Repair',
        initial: 'NR',
        isNext: false,
        date: '2026-10-21',
    }
];

// Pub-sub listener bucket
const listeners = new Set<() => void>();

export const jobsStore = {
    getJobs: () => globalJobs,
    addJob: (job: JobRequest) => {
        globalJobs = [...globalJobs, job]; // Add to end or beginning; let's add to beginning
        globalJobs = [job, ...globalJobs.filter(j => j.id !== job.id)];
        listeners.forEach(l => l());
    },
    clearJobs: () => {
        globalJobs = [];
        listeners.forEach(l => l());
    }
};

// React Hook to access synchronized global jobs
export function useJobs() {
    const [jobs, setLocalJobs] = useState(globalJobs);

    useEffect(() => {
        const listener = () => setLocalJobs([...globalJobs]);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    return jobs;
}
