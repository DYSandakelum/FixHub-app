import { useRef, useState } from "react";
import { router } from "expo-router";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Avatar,
  BookingUnavailable,
  Button,
  ErrorText,
  Header,
  Icon,
  Screen,
} from "@/components/transaction/ui";
import { transactionColors as c } from "@/constants/transaction";
import { useTransaction } from "@/hooks/use-transaction";
import type { Message } from "@/lib/transaction-repository";

export default function ChatScreen() {
  const tx = useTransaction();
  const [draft, setDraft] = useState("");
  const [options, setOptions] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);
  const [quick, setQuick] = useState(false);
  const list = useRef<FlatList<Message>>(null);
  async function send() {
    const body = draft.trim();
    if (!body || tx.busy) return;
    if (await tx.send(body)) setDraft("");
  }
  if (!tx.isDemo && !tx.ready)
    return (
      <BookingUnavailable
        loading={tx.loading}
        error={tx.error}
        onRetry={() => {
          void tx.refresh();
        }}
      />
    );
  return (
    <Screen>
      <Header
        title="Support Chat"
        subtitle={`Active: Provider ${tx.isDemo ? "Marcus" : tx.booking.providerName}`}
        onMore={() => setOptions(true)}
      />
      <ErrorText>{tx.error}</ErrorText>
      <FlatList
        ref={list}
        data={tx.messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.history}
        onContentSizeChange={() =>
          list.current?.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Text style={s.day}>
            {tx.isDemo ? "Today • 10:24 AM" : "Booking conversation"}
          </Text>
        }
        ListEmptyComponent={
          <Text style={s.empty}>
            {tx.loading
              ? "Loading messages…"
              : "Start a conversation with your provider."}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[s.messageRow, item.mine && s.mineRow]}>
            <View style={s.avatar}>
              <Avatar customer={item.mine} />
            </View>
            <Pressable
              accessibilityLabel={
                item.mine
                  ? `${item.body}. Long press to delete your message.`
                  : item.body
              }
              onLongPress={() => {
                if (item.mine) setSelected(item);
              }}
              delayLongPress={450}
              style={[s.bubble, item.mine && s.mineBubble]}
            >
              <Text style={[s.messageText, item.mine && s.mineText]}>
                {item.body}
              </Text>
              <Text style={[s.time, item.mine && s.mineTime]}>
                {new Date(item.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: "Asia/Colombo",
                })}
              </Text>
            </Pressable>
          </View>
        )}
      />
      {quick && (
        <View style={s.quick}>
          <Text style={s.quickTitle}>Quick messages</Text>
          {[
            "Where are you now?",
            "Please call when you arrive.",
            "The gate is unlocked.",
          ].map((text) => (
            <Pressable
              key={text}
              accessibilityRole="button"
              onPress={() => {
                setDraft(text);
                setQuick(false);
              }}
              style={s.quickItem}
            >
              <Text style={s.quickText}>{text}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <View style={s.composer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quick messages"
          style={s.add}
          onPress={() => setQuick(!quick)}
        >
          <Icon name={quick ? "close" : "add"} size={23} />
        </Pressable>
        <TextInput
          accessibilityLabel="Type a message"
          style={s.input}
          value={draft}
          onChangeText={setDraft}
          maxLength={2000}
          placeholder="Type a message..."
          placeholderTextColor="#9AAAC1"
          multiline
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          disabled={!draft.trim() || tx.busy || tx.loading || !tx.ready}
          onPress={() => {
            void send();
          }}
          style={[s.send, (!draft.trim() || tx.busy) && s.disabled]}
        >
          <Icon name="arrow-up" color={c.white} size={23} />
        </Pressable>
      </View>
      <Modal
        visible={options || !!selected}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setOptions(false);
          setSelected(null);
        }}
      >
        <View style={s.overlay}>
          <View style={s.menu}>
            {selected ? (
              <>
                <Text style={s.menuTitle}>Delete your message?</Text>
                <Text style={s.preview}>{selected.body}</Text>
                <Button
                  title="Delete Message"
                  busy={tx.busy}
                  onPress={() => {
                    void tx.deleteMessage(selected.id).then((ok) => {
                      if (ok) setSelected(null);
                    });
                  }}
                />
                <ErrorText>{tx.error}</ErrorText>
              </>
            ) : (
              <>
                <Text style={s.menuTitle}>Conversation options</Text>
                <Button
                  title="View Booking"
                  secondary
                  onPress={() => {
                    setOptions(false);
                    router.navigate(tx.route("/booking-tracking"));
                  }}
                />
                <Button
                  title="Rate & Review"
                  secondary
                  onPress={() => {
                    setOptions(false);
                    router.push(tx.route("/rate-review"));
                  }}
                />
                <Button
                  title="Refresh Messages"
                  secondary
                  onPress={() => {
                    setOptions(false);
                    void tx.refresh();
                  }}
                />
                <Text style={s.preview}>
                  Long press a message you sent to delete it.
                </Text>
              </>
            )}
            <Button
              title="Cancel"
              secondary
              onPress={() => {
                setOptions(false);
                setSelected(null);
              }}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  history: { padding: 16, paddingBottom: 24, flexGrow: 1 },
  day: {
    color: "#8BA0BC",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 18,
  },
  empty: { color: c.muted, fontSize: 13, textAlign: "center", marginTop: 24 },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 15,
  },
  mineRow: { flexDirection: "row-reverse" },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    maxWidth: "76%",
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 13,
    borderTopLeftRadius: 0,
    padding: 12,
    boxShadow: "0px 4px 9px rgba(23,32,51,0.04)",
  },
  mineBubble: {
    backgroundColor: c.blue,
    borderColor: c.blue,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 0,
    boxShadow: "0px 4px 9px rgba(36,99,245,0.18)",
  },
  messageText: {
    color: c.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  mineText: { color: c.white },
  time: { textAlign: "right", fontSize: 10, color: "#8BA0BC", marginTop: 5 },
  mineTime: { color: "#D4E1FF" },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
  },
  add: {
    width: 40,
    height: 42,
    borderWidth: 1,
    borderColor: c.paleBorder,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.background,
    fontSize: 14,
    color: c.text,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: c.blue,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 8px rgba(36,99,245,0.2)",
  },
  disabled: { opacity: 0.65 },
  quick: { padding: 16, gap: 7, borderTopWidth: 1, borderColor: c.border },
  quickTitle: { fontWeight: "600", color: c.text, marginBottom: 3 },
  quickItem: { padding: 10, backgroundColor: c.white, borderRadius: 9 },
  quickText: { color: c.blue, fontSize: 13 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(23,32,51,.35)",
    justifyContent: "center",
    padding: 24,
  },
  menu: {
    backgroundColor: c.white,
    borderRadius: 20,
    padding: 22,
    gap: 12,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  menuTitle: { fontSize: 18, fontWeight: "700", color: c.text },
  preview: { color: c.muted, fontSize: 13, lineHeight: 20 },
});
