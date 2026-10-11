import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    English: {
        translation: {
            // Navigation Tabs
            'Dashboard': 'Dashboard',
            'Schedule': 'Schedule',
            'Earnings': 'Earnings',
            'Profile': 'Profile',

            // App / Settings generic
            'Settings': 'Settings',
            'Vacation mode': 'Vacation mode',
            'Pause new requests': 'Pause new requests while you\'re away',
            'WORK PREFERENCES': 'WORK PREFERENCES',
            'Service Category': 'Service Category',
            'Service area': 'Service area',
            'Service Area': 'Service Area',
            'Select your operation region': 'Select your operation region',
            'Working hours': 'Working hours',
            'Edit Working Hours': 'Edit Working Hours',
            'Set your preferred availability': 'Set your preferred availability',
            'Start Time': 'Start Time',
            'End Time': 'End Time',
            'Confirm selection': 'Confirm selection',
            'Auto-accept jobs': 'Auto-accept jobs',
            'Only requests above': 'Only requests above Rs 5,000',
            'NOTIFICATIONS': 'NOTIFICATIONS',
            'New request alerts': 'New request alerts',
            'Sound and vibration': 'Sound and vibration',
            'Job reminders': 'Job reminders',
            'Quiet hours': 'Quiet hours',
            'PAYMENTS': 'PAYMENTS',
            'Payout method': 'Payout method',
            'Account Details': 'Account Details',
            'Update your primary bank info': 'Update your primary bank info',
            'Bank Name': 'Bank Name',
            'Account Number': 'Account Number',
            'Payout schedule': 'Payout schedule',
            'When do you want to receive payments?': 'When do you want to receive payments?',
            'APP': 'APP',
            'Language': 'Language',
            'Dark mode': 'Dark mode',
            'ACCOUNT': 'ACCOUNT',
            'Log out': 'Log out',
            'Hourly': 'Hourly',
            'Daily': 'Daily',
            'Weekly': 'Weekly',
            'Monthly': 'Monthly',
            'Cancel': 'Cancel',
            'Save': 'Save',

            // Dashboard Hero & Status
            'Service Provider': 'Service Provider',
            'You\'re online': 'You\'re online',
            'Receiving new job requests': 'Receiving new job requests',
            'You\'re offline': 'You\'re offline',
            'Vacation mode active': 'Vacation mode active',
            'You are currently offline': 'You are currently offline',
            'Go online to receive': 'Go online to receive new job requests matching your category.',
            'Waiting for new requests...': 'Waiting for new requests...',
            'Keep your profile active. We\'ll notify you when a job matches your area.': 'Keep your profile active. We\'ll notify you when a job matches your area.',

            // Dashboard Earnings Card
            'TODAY\'S EARNINGS': 'TODAY\'S EARNINGS',
            'jobs completed': 'jobs completed',
            'Last payment:': 'Last payment:',
            'Today': 'Today',
            'Today, 2:30 PM': 'Today, 2:30 PM',
            'View breakdown': 'View breakdown',

            // Dashboard New Request Card
            'New request': 'New request',
            'Expires in': 'Expires in',
            'Estimated earning': 'Estimated earning',
            'away': 'away',
            'Decline': 'Decline',
            'Accept job': 'Accept job',

            // Dashboard Schedule & History
            'Today\'s schedule': 'Today\'s schedule',
            'jobs': 'jobs',
            'Recent client reviews': 'Recent client reviews',
            'Tomorrow': 'Tomorrow',
            'Completed': 'Completed',
            'In Progress': 'In Progress',
            'Confirmed': 'Confirmed',
            'Pending': 'Pending',

            // Dashboard Modals
            'Notifications': 'Notifications',
            'Earnings Breakdown': 'Earnings Breakdown',
            'Base Pay': 'Base Pay',
            'Customer Tips': 'Customer Tips',
            'Platform Fee (5%)': 'Platform Fee (5%)',
            'Total Earnings': 'Total Earnings',

            // Schedule Screen
            'My Schedule': 'My Schedule',
            'ONLINE': 'ONLINE',
            'OFFLINE': 'OFFLINE',
            'Today, 16:00': 'Today, 16:00',
            'Tomorrow, 16:00': 'Tomorrow, 16:00',
            'Confirmed - On the way': 'Confirmed - On the way',

            // Earnings Screen
            'Earnings Overview': 'Earnings Overview',
            'Total balance': 'Total balance',
            'Recent Transactions': 'Recent Transactions',
            'Filter by date': 'Filter by date',
            'Download Statement': 'Download Statement',

            // Profile Screen
            'Jobs done': 'Jobs done',
            'Rating': 'Rating',
            'Experience': 'Experience',
            'Profile strength': 'Profile strength',
            'Add a certificate to get more job requests.': 'Add a certificate to get more job requests.',
            'My Account': 'My Account',
            'Name, phone, services and bio': 'Name, phone, services and bio',
            'Hours, notifications, payouts': 'Hours, notifications, payouts',
            'Help & support': 'Help & support',
            'FAQs and contact us': 'FAQs and contact us',
            'Version': 'Version',

            // Request Details & Job Completion
            'Request Details': 'Request Details',
            'Customer': 'Customer',
            'Call': 'Call',
            'Message': 'Message',
            'Service Location': 'Service Location',
            'Start Job': 'Start Job',
            'In-Progress': 'In-Progress',
            'Complete Job': 'Complete Job',
            'Send Invoice': 'Send Invoice',
            'Base Fee': 'Base Fee',
            'Material Cost': 'Material Cost',
            'Total Amount': 'Total Amount',
            'Job Summary': 'Job Summary',
            'Complete Service': 'Complete Service',

            // Professions & Categories
            'Cleaner': 'Cleaner',
            'Electrician': 'Electrician',
            'Plumber': 'Plumber',
            'AC Technician': 'AC Technician',
            'Carpenter': 'Carpenter',
            'Painter': 'Painter',
            'Mechanic': 'Mechanic',
            'Deep Cleaning': 'Deep Cleaning',
            'Cleaning': 'Cleaning',
            'Electrical': 'Electrical',
            'Plumbing': 'Plumbing',
        }
    },
    Sinhala: {
        translation: {
            // Navigation Tabs
            'Dashboard': 'පුවරුව',
            'Schedule': 'කාලසටහන',
            'Earnings': 'ඉපැයීම්',
            'Profile': 'පැතිකඩ',

            // App / Settings generic
            'Settings': 'සැකසුම්',
            'Vacation mode': 'නිවාඩු මාදිලිය',
            'Pause new requests': 'ඔබ බැහැරව සිටින විට නව ඉල්ලීම් නවත්වන්න',
            'WORK PREFERENCES': 'වැඩ මනාපයන්',
            'Service Category': 'සේවා කාණ්ඩය',
            'Service area': 'සේවා ප්‍රදේශය',
            'Service Area': 'සේවා ප්‍රදේශය',
            'Select your operation region': 'ඔබේ මෙහෙයුම් කලාපය තෝරන්න',
            'Working hours': 'වැඩ කරන පැය',
            'Edit Working Hours': 'වැඩ කරන වේලාවන් වෙනස් කරන්න',
            'Set your preferred availability': 'ඔබ කැමති සේවා ලබා දීමේ වේලාවන් සකසන්න',
            'Start Time': 'ආරම්භක වේලාව',
            'End Time': 'අවසාන වේලාව',
            'Confirm selection': 'තේරීම තහවුරු කරන්න',
            'Auto-accept jobs': 'රැකියා ස්වයංක්‍රීයව පිළිගන්න',
            'Only requests above': 'රු 5,000 ට වැඩි ඉල්ලීම් පමණි',
            'NOTIFICATIONS': 'දැනුම්දීම්',
            'New request alerts': 'නව ඉල්ලීම් ඇඟවීම්',
            'Sound and vibration': 'ශබ්දය සහ කම්පනය',
            'Job reminders': 'රැකියා මතක් කිරීම්',
            'Quiet hours': 'නිහඬ පැය',
            'PAYMENTS': 'ගෙවීම්',
            'Payout method': 'ගෙවීමේ ක්‍රමය',
            'Account Details': 'ගිණුම් විස්තර',
            'Update your primary bank info': 'ඔබගේ ප්‍රධාන බැංකු තොරතුරු යාවත්කාලීන කරන්න',
            'Bank Name': 'බැංකුවේ නම',
            'Account Number': 'ගිණුම් අංකය',
            'Payout schedule': 'ගෙවීම් කාලසටහන',
            'When do you want to receive payments?': 'ඔබට ගෙවීම් ලබා ගැනීමට අවශ්‍ය කවදාද?',
            'APP': 'යෙදුම',
            'Language': 'භාෂාව',
            'Dark mode': 'අඳුරු මාදිලිය',
            'ACCOUNT': 'ගිණුම',
            'Log out': 'ඉවත් වන්න',
            'Hourly': 'පැයකට වරක්',
            'Daily': 'දිනපතා',
            'Weekly': 'සතිපතා',
            'Monthly': 'මාසිකව',
            'Cancel': 'අවලංගු කරන්න',
            'Save': 'සුරකින්න',

            // Dashboard Hero & Status
            'Service Provider': 'සේවා සපයන්නා',
            'You\'re online': 'ඔබ මාර්ගගතව සිටී',
            'Receiving new job requests': 'නව රැකියා ඉල්ලීම් ලබා ගනිමින්',
            'You\'re offline': 'ඔබ නොබැඳී ඇත',
            'Vacation mode active': 'නිවාඩු මාදිලිය සක්‍රීයයි',
            'You are currently offline': 'ඔබ දැනට නොබැඳී ඇත',
            'Go online to receive': 'ඔබේ කාණ්ඩයට ගැලපෙන නව රැකියා ලබා ගැනීමට මාර්ගගත වන්න.',
            'Waiting for new requests...': 'නව ඉල්ලීම් එනතුරු බලා සිටී...',
            'Keep your profile active. We\'ll notify you when a job matches your area.': 'ඔබේ පැතිකඩ සක්‍රීයව තබන්න. රැකියාවක් ඇති විට දැනුම් දෙනු ලැබේ.',

            // Dashboard Earnings Card
            'TODAY\'S EARNINGS': 'අද ඉපැයීම්',
            'jobs completed': 'රැකියා නිම කරන ලදී',
            'Last payment:': 'අවසන් ගෙවීම:',
            'Today': 'අද',
            'Today, 2:30 PM': 'අද, පස්වරු 2:30',
            'View breakdown': 'බිඳවැටීම බලන්න',

            // Dashboard New Request Card
            'New request': 'නව ඉල්ලීමක්',
            'Expires in': 'කල් ඉකුත් වීමට ඉතිරිව ඇත්තේ',
            'Estimated earning': 'ඇස්තමේන්තුගත ඉපැයීම',
            'away': 'දුරින්',
            'Decline': 'ප්‍රතික්ෂේප කරන්න',
            'Accept job': 'රැකියාව පිළිගන්න',

            // Dashboard Schedule & History
            'Today\'s schedule': 'අද දවසේ කාලසටහන',
            'jobs': 'රැකියා',
            'Recent client reviews': 'පාරිභෝගික සමාලෝචන',
            'Tomorrow': 'හෙට',
            'Completed': 'සම්පූර්ණයි',
            'In Progress': 'ක්‍රියාත්මක වෙමින් පවතී',
            'Confirmed': 'තහවුරු කරන ලදී',
            'Pending': 'පොරොත්තුවේ',

            // Dashboard Modals
            'Notifications': 'දැනුම්දීම්',
            'Earnings Breakdown': 'ඉපැයීම් බිඳවැටීම',
            'Base Pay': 'මූලික ගෙවීම',
            'Customer Tips': 'පාරිභෝගික තිළිණ (Tips)',
            'Platform Fee (5%)': 'පද්ධති ගාස්තුව (5%)',
            'Total Earnings': 'මුළු ඉපැයීම්',

            // Schedule Screen
            'My Schedule': 'මගේ කාලසටහන',
            'ONLINE': 'සක්‍රීයයි',
            'OFFLINE': 'අක්‍රීයයි',
            'Today, 16:00': 'අද, 16:00',
            'Tomorrow, 16:00': 'හෙට, 16:00',
            'Confirmed - On the way': 'තහවුරු කර ඇත - ගමන් කරමින්',

            // Earnings Screen
            'Earnings Overview': 'ඉපැයීම් දළ විශ්ලේෂණය',
            'Total balance': 'මුළු ශේෂය',
            'Recent Transactions': 'මෑත ගනුදෙනු',
            'Filter by date': 'දිනය අනුව පෙරන්න',
            'Download Statement': 'ප්‍රකාශය බාගන්න',

            // Profile Screen
            'Jobs done': 'කළ රැකියා',
            'Rating': 'ශ්‍රේණිගත කිරීම',
            'Experience': 'පළපුරුද්ද',
            'Profile strength': 'පැතිකඩ ශක්තිය',
            'Add a certificate to get more job requests.': 'තවත් රැකියා ලබා ගැනීමට සහතිකයක් එක් කරන්න.',
            'My Account': 'මගේ ගිණුම',
            'Name, phone, services and bio': 'නම, දුරකථන, සේවා සහ විස්තර',
            'Hours, notifications, payouts': 'පැය, දැනුම්දීම්, ගෙවීම්',
            'Help & support': 'උදව් සහ සහාය',
            'FAQs and contact us': 'නිතර අසන ප්‍රශ්න සහ සම්බන්ධතා',
            'Version': 'අනුවාදය',

            // Request Details & Job Completion
            'Request Details': 'ඉල්ලීමේ විස්තර',
            'Customer': 'පාරිභෝගිකයා',
            'Call': 'ඇමතුම',
            'Message': 'පණිවිඩය',
            'Service Location': 'සේවා ස්ථානය',
            'Start Job': 'රැකියාව අරඹන්න',
            'In-Progress': 'ක්‍රියාත්මක වෙමින් පවතී',
            'Complete Job': 'රැකියාව අවසන් කරන්න',
            'Send Invoice': 'ඉන්වොයිසිය යවන්න',
            'Base Fee': 'මූලික ගාස්තුව',
            'Material Cost': 'ද්‍රව්‍ය පිරිවැය',
            'Total Amount': 'මුළු මුදල',
            'Job Summary': 'රැකියා සාරාංශය',
            'Complete Service': 'සේවාව අවසන් කරන්න',

            // Professions & Categories
            'Cleaner': 'පිරිසිදු කරන්නා (Cleaner)',
            'Electrician': 'විදුලි කාර්මිකයා (Electrician)',
            'Plumber': 'නල කාර්මිකයා (Plumber)',
            'AC Technician': 'වායුසමීකරණ කාර්මිකයා (AC Tech)',
            'Carpenter': 'වඩු කාර්මිකයා (Carpenter)',
            'Painter': 'තීන්ත ආලේපක (Painter)',
            'Mechanic': 'කාර්මික ශිල්පී (Mechanic)',
            'Deep Cleaning': 'ගැඹුරු පිරිසිදු කිරීම',
            'Cleaning': 'පිරිසිදු කිරීම',
            'Electrical': 'විදුලි කාර්මික',
            'Plumbing': 'නල කාර්මික',
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
