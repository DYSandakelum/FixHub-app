import { useState } from "react";
import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Actions,
  Avatar,
  BookingUnavailable,
  BottomNav,
  Button,
  Content,
  ErrorText,
  Header,
  Icon,
  Screen,
} from "@/components/transaction/ui";
import { bookingStages, transactionColors as c } from "@/constants/transaction";
import { useTransaction } from "@/hooks/use-transaction";

export default function BookingTrackingScreen() {
  const tx = useTransaction();
  const [options, setOptions] = useState(false);
  const current = bookingStages.indexOf(tx.booking.status);
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
      <View style={s.topSpace} />
      <Header
        title="Booking Status"
        onMore={() => setOptions(true)}
        fallback="/payment"
      />
      <Content>
        <View style={s.timeline}>
          {bookingStages.map((stage, i) => (
            <View
              key={stage}
              style={s.stage}
              accessible
              accessibilityLabel={`${stage}${i === current ? ", current status" : i < current ? ", complete" : ", upcoming"}`}
            >
              <View style={s.track}>
                {i < bookingStages.length - 1 && (
                  <View style={[s.line, i < current && s.activeLine]} />
                )}
                <View style={[s.dot, i <= current && s.activeDot]} />
              </View>
              <Text style={[s.stageText, i <= current && s.activeText]}>
                {stage}
              </Text>
            </View>
          ))}
        </View>
        <View style={s.providerDivider} />
        <View style={s.provider}>
          <Avatar prasanna={tx.isDemo} />
          <View style={s.providerInfo}>
            <Text style={s.name}>{tx.booking.providerName}</Text>
            <Text style={s.speciality}>Specialist Plumber</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Contact provider"
            onPress={() => router.push(tx.route("/chat"))}
            style={s.phone}
          >
            <Icon name="call-outline" size={17} />
          </Pressable>
        </View>
        <ErrorText>{tx.error}</ErrorText>
        {tx.loading && <Text style={s.loading}>Loading booking status…</Text>}
      </Content>
      <Actions>
        <Button
          title={
            tx.booking.status === "Completed"
              ? "Rate & Review"
              : "Contact Provider"
          }
          disabled={tx.loading || !tx.ready}
          onPress={() =>
            router.push(
              tx.route(
                tx.booking.status === "Completed" ? "/rate-review" : "/chat",
              ),
            )
          }
        />
      </Actions>
      <BottomNav />
      <Modal
        visible={options}
        transparent
        animationType="fade"
        onRequestClose={() => setOptions(false)}
      >
        <View style={s.overlay}>
          <View style={s.menu}>
            <Text style={s.menuTitle}>Booking options</Text>
            <Button
              title="Refresh Status"
              secondary
              onPress={() => {
                setOptions(false);
                void tx.refresh();
              }}
            />
            <Button
              title="View Payment"
              secondary
              onPress={() => {
                setOptions(false);
                router.push(tx.route("/payment"));
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
            {tx.isDemo && (
              <>
                <Text style={s.help}>
                  Demo controls simulate the provider updating your booking.
                </Text>
                <Button
                  title="Advance Demo Status"
                  disabled={tx.booking.status === "Completed"}
                  onPress={() => {
                    setOptions(false);
                    void tx.advanceDemo();
                  }}
                />
                <Button
                  title="Reset Demo"
                  secondary
                  onPress={() => {
                    setOptions(false);
                    void tx.reset();
                  }}
                />
              </>
            )}
            <Button title="Close" secondary onPress={() => setOptions(false)} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  phone: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: c.paleBlue,
    borderWidth: 1,
    borderColor: c.paleBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  topSpace: { height: 36 },
  timeline: { marginTop: 47, marginLeft: 17, marginBottom: 8 },
  stage: { flexDirection: "row", minHeight: 55 },
  track: { width: 27, alignItems: "center" },
  line: {
    position: "absolute",
    width: 2,
    backgroundColor: "#DCE4EF",
    top: 8,
    bottom: -8,
  },
  activeLine: { backgroundColor: "#829DFF" },
  dot: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#CFD8E5",
    backgroundColor: c.white,
    zIndex: 1,
  },
  activeDot: { backgroundColor: c.blue, borderColor: c.blue },
  stageText: { fontSize: 13, color: c.muted, paddingTop: 12, marginLeft: 14 },
  activeText: { color: c.text, fontWeight: "700" },
  providerDivider: {
    height: 1,
    backgroundColor: c.border,
    marginTop: 5,
    marginBottom: 17,
  },
  provider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 11,
    backgroundColor: c.white,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: c.border,
    boxShadow: "0px 4px 12px rgba(23,32,51,0.04)",
  },
  providerInfo: { flex: 1 },
  name: { fontSize: 13, fontWeight: "700", color: c.text },
  speciality: { fontSize: 12, color: c.muted, marginTop: 3 },
  loading: { marginTop: 16, color: c.muted },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(23,32,51,.35)",
  },
  menu: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    padding: 22,
    backgroundColor: c.white,
    borderRadius: 20,
    gap: 12,
  },
  menuTitle: { fontSize: 18, color: c.text, fontWeight: "700" },
  help: { fontSize: 12, lineHeight: 18, color: c.muted },
});
