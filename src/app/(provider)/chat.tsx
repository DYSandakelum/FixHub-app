import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="chevron-left" size={28} color="#2563EB" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Alice Cooper</Text>
                    <Text style={styles.headerSubtitle}>Active: Customer</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <MaterialIcons name="more-horiz" size={24} color="#2563EB" />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* ── Chat Container ── */}
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>

                    <Text style={styles.dateStamp}>Today • 10:24 AM</Text>

                    {/* ── My Message (Provider) - Right Side ── */}
                    <View style={[styles.messageRow, styles.messageRowRight]}>
                        <View style={[styles.messageBubble, styles.myBubble]}>
                            <Text style={styles.myMessageText}>
                                Hello! I am currently on my way to your location. I should arrive in about 10 minutes.
                            </Text>
                            <Text style={styles.myTimeText}>10:25 AM</Text>
                        </View>
                        <View style={styles.myAvatar}>
                            <Text style={styles.avatarText}>ME</Text>
                        </View>
                    </View>

                    {/* ── Their Message (Customer) - Left Side ── */}
                    <View style={[styles.messageRow, styles.messageRowLeft]}>
                        <View style={styles.theirAvatar}>
                            <Text style={styles.avatarText}>AC</Text>
                        </View>
                        <View style={[styles.messageBubble, styles.theirBubble]}>
                            <Text style={styles.theirMessageText}>
                                Perfect, thank you for the update! I will make sure the gate is unlocked for you.
                            </Text>
                            <Text style={styles.theirTimeText}>10:27 AM</Text>
                        </View>
                    </View>

                    {/* ── Typing Indicator - Left Side ── */}
                    <View style={[styles.messageRow, styles.messageRowLeft, { marginTop: 16 }]}>
                        <View style={styles.theirAvatar}>
                            <Text style={styles.avatarText}>AC</Text>
                        </View>
                        <View style={styles.typingBubble}>
                            <View style={styles.dot} />
                            <View style={[styles.dot, { opacity: 0.6 }]} />
                            <View style={[styles.dot, { opacity: 0.3 }]} />
                        </View>
                    </View>

                </ScrollView>

                {/* ── Bottom Input Area ── */}
                <View style={styles.inputArea}>
                    <TouchableOpacity style={styles.addButton}>
                        <Feather name="plus" size={24} color="#2563EB" />
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type a message..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                        />
                    </View>

                    <TouchableOpacity style={styles.sendButton}>
                        <Feather name="arrow-up" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    keyboardContainer: {
        flex: 1,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FAFAFA',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 2,
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },

    // Chat ScrollArea
    chatScroll: {
        padding: 16,
        paddingBottom: 24,
    },
    dateStamp: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        textAlign: 'center',
        marginVertical: 16,
    },

    // Message Rows
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    messageRowRight: {
        justifyContent: 'flex-end',
    },
    messageRowLeft: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    // My Messages (Provider) - Right/Blue
    myBubble: {
        backgroundColor: '#2563EB',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 4,
        marginRight: 8,
    },
    myMessageText: {
        fontSize: 15,
        color: '#fff',
        lineHeight: 22,
    },
    myTimeText: {
        fontSize: 11,
        color: '#BFDBFE',
        alignSelf: 'flex-end',
        marginTop: 6,
    },
    myAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1E3A8A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Their Messages (Customer) - Left/Grey
    theirBubble: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 18,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    theirMessageText: {
        fontSize: 15,
        color: '#1F2937',
        lineHeight: 22,
    },
    theirTimeText: {
        fontSize: 11,
        color: '#9CA3AF',
        alignSelf: 'flex-end',
        marginTop: 6,
    },
    theirAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FDE68A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
    },

    // Typing
    typingBubble: {
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginLeft: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#2563EB',
    },

    // Bottom Input
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    inputContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 10,
    },
    textInput: {
        fontSize: 15,
        color: '#111827',
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
