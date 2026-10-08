import { useState } from "react";
import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Actions,
  BookingUnavailable,
  BottomNav,
  Button,
  Card,
  Content,
  ErrorText,
  Field,
  Header,
  Label,
  Screen,
} from "@/components/transaction/ui";
import {
  transactionColors as c,
  type PaymentMethod,
} from "@/constants/transaction";
import { useTransaction } from "@/hooks/use-transaction";

export default function PaymentScreen() {
  const tx = useTransaction();
  const [method, setMethod] = useState<PaymentMethod>("Card Payment");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [validation, setValidation] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  async function pay() {
    setValidation("");
    if (tx.booking.paid) {
      router.navigate(tx.route("/booking-tracking"));
      return;
    }
    if (method === "Card Payment" && tx.isDemo) {
      if (!/^\d{16}$/.test(card.replace(/\s/g, ""))) {
        setValidation("Enter a 16-digit demo card number.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        setValidation("Enter the expiry as MM/YY.");
        return;
      }
      const [month, year] = expiry.split("/").map(Number);
      if (new Date(2000 + year, month) <= new Date()) {
        setValidation("This card has expired. Use a future expiry date.");
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setValidation("Enter a 3 or 4 digit CVV.");
        return;
      }
    }
    if (await tx.pay(method)) {
      setCard("");
      setExpiry("");
      setCvv("");
      setConfirmation(true);
    }
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
      <Header title="Payment" fallback="/(booking)/booking" />
      <Content>
        <Card>
          <Label>Order Summary</Label>
          {[
            ["Service:", tx.booking.service],
            ["Provider:", tx.booking.providerName],
            ["Date & Time:", tx.booking.dateTime],
          ].map(([key, value]) => (
            <View key={key} style={s.summary}>
              <Text style={s.key}>{key}</Text>
              <Text style={s.value}>{value}</Text>
            </View>
          ))}
          <View style={s.total}>
            <Text style={s.totalLabel}>Total Price:</Text>
            <Text style={s.price}>
              LKR {tx.booking.amount.toLocaleString("en-US")}
            </Text>
          </View>
        </Card>
        <View style={s.methods}>
          <Label>Select Payment Method</Label>
          {(
            [
              "Cash on Delivery",
              "Card Payment",
              "Bank Transfer",
            ] as PaymentMethod[]
          ).map((item) => (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ checked: method === item }}
              onPress={() => {
                setMethod(item);
                setValidation("");
              }}
              style={[s.method, method === item && s.selected]}
            >
              <View style={[s.radio, method === item && s.radioSelected]}>
                {method === item && <View style={s.radioDot} />}
              </View>
              <Text style={[s.methodLabel, method === item && s.selectedText]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
        {method === "Card Payment" && (
          <View style={s.fields}>
            <Field
              label="Card Number"
              value={card}
              placeholder="XXXX XXXX XXXX XXXX"
              keyboardType="number-pad"
              maxLength={19}
              onChangeText={(v) =>
                setCard(
                  v
                    .replace(/\D/g, "")
                    .slice(0, 16)
                    .replace(/(.{4})/g, "$1 ")
                    .trim(),
                )
              }
            />
            <View style={s.fieldRow}>
              <Field
                label="Expiry Date"
                value={expiry}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                onChangeText={(v) => {
                  const digits = v.replace(/\D/g, "").slice(0, 4);
                  setExpiry(
                    digits.length > 2
                      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                      : digits,
                  );
                }}
              />
              <Field
                label="CVV"
                value={cvv}
                placeholder="XXX"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={4}
                onChangeText={(v) => setCvv(v.replace(/\D/g, ""))}
              />
            </View>
          </View>
        )}
        {method === "Bank Transfer" && (
          <Card>
            <Text style={s.note}>
              {tx.isDemo
                ? "Bank transfer is simulated in this demo. No money will be transferred."
                : "Bank transfer details will be available when your team connects the payment service."}
            </Text>
          </Card>
        )}
        {method === "Cash on Delivery" && (
          <Card>
            <Text style={s.note}>
              Pay your provider after the service is completed. Your payment
              will be recorded as pending collection.
            </Text>
          </Card>
        )}
        {tx.isDemo && (
          <Text style={s.demo}>
            Demo booking · No real charge. Use sample card details.
          </Text>
        )}
        <ErrorText>{validation || tx.error}</ErrorText>
      </Content>
      <Actions>
        <Button
          title={tx.booking.paid ? "View Booking" : "Pay Now"}
          busy={tx.busy}
          disabled={tx.loading || !tx.ready}
          onPress={() => {
            void pay();
          }}
        />
      </Actions>
      <BottomNav />
      <Modal
        visible={confirmation}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setConfirmation(false);
          router.replace(tx.route("/booking-tracking"));
        }}
      >
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>
              {tx.isDemo ? "Demo payment recorded" : "Payment method confirmed"}
            </Text>
            <Text style={s.note}>
              {tx.isDemo
                ? "No money was charged. You can now track your booking."
                : "Cash payment is pending collection by your provider."}
            </Text>
            <Button
              title="Track Booking"
              onPress={() => {
                setConfirmation(false);
                router.replace(tx.route("/booking-tracking"));
              }}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 9,
  },
  key: { color: "#8192AD", fontSize: 12 },
  value: {
    color: c.text,
    fontWeight: "600",
    fontSize: 12,
    flex: 1,
    textAlign: "right",
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: c.border,
    paddingTop: 11,
  },
  totalLabel: { fontSize: 13, fontWeight: "700", color: c.text },
  price: { color: c.blue, fontWeight: "800", fontSize: 18 },
  methods: { marginTop: 19, marginBottom: 16 },
  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    minHeight: 42,
    backgroundColor: c.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 12,
    marginBottom: 7,
  },
  selected: {
    backgroundColor: c.paleBlue,
    borderColor: c.blue,
    borderWidth: 2,
  },
  radio: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#CCD9EB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { backgroundColor: c.blue, borderColor: c.blue },
  radioDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: c.white },
  methodLabel: { fontSize: 13, color: c.text },
  selectedText: { color: c.blue, fontWeight: "600" },
  fields: { gap: 14 },
  fieldRow: { flexDirection: "row", gap: 12 },
  note: { fontSize: 13, color: c.muted, lineHeight: 20 },
  demo: { fontSize: 11, color: c.muted, marginTop: 14 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(23,32,51,.35)",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: c.white,
    gap: 20,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: c.text },
});
