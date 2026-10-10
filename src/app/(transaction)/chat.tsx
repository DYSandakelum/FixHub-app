import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import { supabase } from '../../lib/supabase';

interface Message {
    id: string;
    text: string;
    sender: 'customer' | 'provider';
    time: string;
}

export default function ChatScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const bookingId = params.bookingId as string | undefined;

    const [providerName, setProviderName] = useState('Service Professional');
    const [serviceType, setServiceType] = useState('Home Service');
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'm1',
            text: 'Hello! Thanks for booking with me. I have confirmed your appointment.',
            sender: 'provider',
            time: '10:15 AM',
        },
        {
            id: 'm2',
            text: 'Hi, thank you! Could you please let me know what tools I should prepare?',
            sender: 'customer',
            time: '10:18 AM',
        },
        {
            id: 'm3',
            text: 'No need to prepare anything, I bring all standard equipment and spare parts with me.',
            sender: 'provider',
            time: '10:20 AM',
        },
        {
            id: 'm4',
            text: 'I am on my way to your location now. Should reach you in about 20 minutes.',
            sender: 'provider',
            time: '10:35 AM',
        },
    ]);

    useEffect(() => {
        if (bookingId) {
            loadBookingInfo();
        } else {
            setLoading(false);
        }
    }, [bookingId]);

    async function loadBookingInfo() {
        setLoading(true);
        const { data } = await supabase
            .from('bookings')
            .select(`
                id,
                providers (
                    service_type,
                    users ( name, phone )
                )
            `)
            .eq('id', bookingId)
            .single();

        if (data) {
            const bookingData: any = data;
            const prov: any = Array.isArray(bookingData.providers)
                ? bookingData.providers[0]
                : bookingData.providers;
            const usr: any = Array.isArray(prov?.users) ? prov.users[0] : prov?.users;

            if (usr?.name) {
                setProviderName(usr.name);
            }
            if (prov?.service_type) {
                setServiceType(prov.service_type);
            }
        }
        setLoading(false);
    }

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMsg: Message = {
            id: `msg_${Date.now()}`,
            text: inputText.trim(),
            sender: 'customer',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Simulated auto-reply after 2 seconds for a realistic demo
        setTimeout(() => {
            const replyMsg: Message = {
                id: `reply_${Date.now()}`,
                text: 'Got it! See you shortly.',
                sender: 'provider',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, replyMsg]);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }, 2000);
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            {/* ── Dark Navy Curved Hero Header ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.headerTop}>
                        <BackButton color="#FFFFFF" />
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle} numberOfLines={1}>
                                {providerName}
                            </Text>
                            <View style={styles.statusRow}>
                                <View style={styles.onlineDot} />
                                <Text style={styles.headerSubtitle}>{serviceType} · Online</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.callBtn}
                            onPress={() => Alert.alert('Calling', `Connecting to ${providerName}...`)}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons name="phone" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* ── Message Bubbles ── */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.chatScroll}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
            >
                <View style={styles.dateStampContainer}>
                    <Text style={styles.dateStamp}>Today • Verified End-to-End Encrypted</Text>
                </View>

                {messages.map((m) => {
                    const isMe = m.sender === 'customer';
                    return (
                        <View
                            key={m.id}
                            style={[
                                styles.messageRow,
                                isMe ? styles.messageRowRight : styles.messageRowLeft,
                            ]}
                        >
                            {!isMe && (
                                <View style={styles.avatarCircle}>
                                    <MaterialIcons name="person" size={18} color="#2563EB" />
                                </View>
                            )}

                            <View
                                style={[
                                    styles.bubble,
                                    isMe ? styles.bubbleCustomer : styles.bubbleProvider,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bubbleText,
                                        isMe ? styles.bubbleTextCustomer : styles.bubbleTextProvider,
                                    ]}
                                >
                                    {m.text}
                                </Text>
                                <Text
                                    style={[
                                        styles.timeText,
                                        isMe ? styles.timeTextCustomer : styles.timeTextProvider,
                                    ]}
                                >
                                    {m.time}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            {/* ── Bottom Input Bar ── */}
            <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message to your provider..."
                        placeholderTextColor="#94A3B8"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={handleSendMessage}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            inputText.trim().length === 0 && styles.sendButtonDisabled,
                        ]}
                        onPress={handleSendMessage}
                        disabled={inputText.trim().length === 0}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="send" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey canvas
    },

    // ── Dark Navy Hero Header ──
    heroBackground: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 16,
        paddingBottom: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? 12 : 0,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94A3B8',
    },
    callBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ── Chat Stream ──
    chatScroll: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    dateStampContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    dateStamp: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 12,
        gap: 8,
    },
    messageRowRight: {
        justifyContent: 'flex-end',
    },
    messageRowLeft: {
        justifyContent: 'flex-start',
    },
    avatarCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubble: {
        maxWidth: '75%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
    },
    bubbleCustomer: {
        backgroundColor: '#2563EB',
        borderBottomRightRadius: 4,
    },
    bubbleProvider: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    bubbleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    bubbleTextCustomer: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    bubbleTextProvider: {
        color: '#0F172A',
        fontWeight: '500',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    timeTextCustomer: {
        color: '#BFDBFE',
    },
    timeTextProvider: {
        color: '#94A3B8',
    },

    // ── Bottom Input Area ──
    bottomBarContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: '#0F172A',
        maxHeight: 100,
    },
    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#94A3B8',
        opacity: 0.5,
    },
});