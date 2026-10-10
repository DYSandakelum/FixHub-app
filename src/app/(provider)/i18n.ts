import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    English: {
        translation: {
            // App / Settings generic
            'Settings': 'Settings',
            'Vacation mode': 'Vacation mode',
            'Pause new requests': 'Pause new requests while you\'re away',
            'WORK PREFERENCES': 'WORK PREFERENCES',
            'Working hours': 'Working hours',
            'Auto-accept jobs': 'Auto-accept jobs',
            'Only requests above': 'Only requests above Rs 5,000',
            'NOTIFICATIONS': 'NOTIFICATIONS',
            'New request alerts': 'New request alerts',
            'Sound and vibration': 'Sound and vibration',
            'Job reminders': 'Job reminders',
            'Quiet hours': 'Quiet hours',
            'PAYMENTS': 'PAYMENTS',
            'Payout method': 'Payout method',
            'Payout schedule': 'Payout schedule',
            'APP': 'APP',
            'Language': 'Language',
            'Dark mode': 'Dark mode',
            'Hourly': 'Hourly',
            'Daily': 'Daily',
            'Weekly': 'Weekly',
            'Monthly': 'Monthly',
            'Cancel': 'Cancel',
            'Save': 'Save',
            // Dashboard
            'You\'re online': 'You\'re online',
            'Receiving new job requests': 'Receiving new job requests',
            'You are currently offline': 'You are currently offline',
            'Go online to receive': 'Go online to receive new job requests matching your category.',
            'TODAY\'S EARNINGS': 'TODAY\'S EARNINGS',
            'jobs completed': 'jobs completed',
            'Last payment:': 'Last payment:',
            'Today': 'Today',
            'View breakdown': 'View breakdown',
            'Dashboard': 'Dashboard',
            'Schedule': 'Schedule',
            'Earnings': 'Earnings',
            'Profile': 'Profile'
        }
    },
    Sinhala: {
        translation: {
            // App / Settings generic
            'Settings': 'සැකසුම්',
            'Vacation mode': 'නිවාඩු මාදිලිය',
            'Pause new requests': 'ඔබ බැහැරව සිටින විට නව ඉල්ලීම් නවත්වන්න',
            'WORK PREFERENCES': 'වැඩ මනාපයන්',
            'Working hours': 'වැඩ කරන පැය',
            'Auto-accept jobs': 'රැකියා ස්වයංක්‍රීයව පිළිගන්න',
            'Only requests above': 'රු 5,000 ට වැඩි ඉල්ලීම් පමණි',
            'NOTIFICATIONS': 'දැනුම්දීම්',
            'New request alerts': 'නව ඉල්ලීම් ඇඟවීම්',
            'Sound and vibration': 'ශබ්දය සහ කම්පනය',
            'Job reminders': 'රැකියා මතක් කිරීම්',
            'Quiet hours': 'නිහඬ පැය',
            'PAYMENTS': 'ගෙවීම්',
            'Payout method': 'ගෙවීමේ ක්‍රමය',
            'Payout schedule': 'ගෙවීම් කාලසටහන',
            'APP': 'යෙදුම',
            'Language': 'භාෂාව',
            'Dark mode': 'අඳුරු මාදිලිය',
            'Hourly': 'පැයකට වරක්',
            'Daily': 'දිනපතා',
            'Weekly': 'සතිපතා',
            'Monthly': 'මාසිකව',
            'Cancel': 'අවලංගු කරන්න',
            'Save': 'සුරකින්න',
            // Dashboard
            'You\'re online': 'ඔබ මාර්ගගතව සිටී',
            'Receiving new job requests': 'නව රැකියා ඉල්ලීම් ලබා ගනිමින්',
            'You are currently offline': 'ඔබ දැනට නොබැඳී ඇත',
            'Go online to receive': 'ඔබේ කාණ්ඩයට ගැලපෙන නව රැකියා ලබා ගැනීමට මාර්ගගත වන්න.',
            'TODAY\'S EARNINGS': 'අද ඉපැයීම්',
            'jobs completed': 'රැකියා නිම කරන ලදී',
            'Last payment:': 'අවසන් ගෙවීම:',
            'Today': 'අද',
            'View breakdown': 'බිඳවැටීම බලන්න',
            'Dashboard': 'උපකරණ පුවරුව',
            'Schedule': 'කාලසටහන',
            'Earnings': 'ඉපැයීම්',
            'Profile': 'පැතිකඩ'
        }
    }
};

export type LangKey = 'English' | 'Sinhala';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        resources,
        lng: 'English',
        fallbackLng: 'English',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
