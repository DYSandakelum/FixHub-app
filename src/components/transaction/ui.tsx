import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams, type Href } from "expo-router";
import type { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transactionColors as c } from "@/constants/transaction";

export function Icon({
  name,
  size = 20,
  color = c.blue,
}: {
  name: ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={s.frame}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Header({
  title,
  subtitle,
  onMore,
  fallback = "/booking-tracking",
}: {
  title: string;
  subtitle?: string;
  onMore?: () => void;
  fallback?: Href;
}) {
  return (
    <View style={[s.header, subtitle ? s.chatHeader : undefined]}>
      <View style={s.headerRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={s.iconHit}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace(fallback)
          }
        >
          <View style={s.back}>
            <Icon name="arrow-back" size={19} />
          </View>
        </Pressable>
        <Text style={s.title}>{title}</Text>
        {onMore && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More options"
            onPress={onMore}
            style={s.iconHit}
          >
            <Icon name="ellipsis-horizontal" size={25} />
          </Pressable>
        )}
      </View>
      {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>
  );
}

export function Content({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      style={s.flex}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Button({
  title,
  onPress,
  secondary,
  busy,
  disabled,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  busy?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (disabled || busy) && s.disabled,
        pressed && s.pressed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={secondary ? c.blue : c.white} />
      ) : (
        <Text style={[s.buttonText, secondary && s.secondaryText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function Actions({ children }: { children: ReactNode }) {
  return <View style={s.actions}>{children}</View>;
}
export function Card({ children }: { children: ReactNode }) {
  return <View style={s.card}>{children}</View>;
}
export function Label({ children }: { children: ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}
export function ErrorText({ children }: { children?: string | null }) {
  return children ? (
    <Text accessibilityRole="alert" style={s.error}>
      {children}
    </Text>
  ) : null;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#9AAAC1"
        selectionColor={c.blue}
        style={s.input}
        {...props}
      />
    </View>
  );
}

export function Avatar({
  large,
  customer,
}: {
  large?: boolean;
  customer?: boolean;
}) {
  return (
    <Image
      source={
        customer
          ? require("../../../assets/images/transaction/customer.png")
          : require("../../../assets/images/transaction/provider.png")
      }
      style={[s.avatar, large && s.largeAvatar]}
      accessibilityLabel={customer ? "Customer portrait" : "Provider portrait"}
    />
  );
}

export function BottomNav() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const tabs = [
    { label: "Dashboard", icon: "home-outline", path: "/(booking)/home" },
    { label: "Bookings", icon: "calendar-outline", path: "/booking-tracking" },
    { label: "Chat", icon: "chatbubbles-outline", path: "/chat" },
    {
      label: "Profile",
      icon: "person-outline",
      path: "/(booking)/provider-profile",
    },
  ] as const;
  return (
    <View style={s.nav}>
      {tabs.map((tab, i) => (
        <Pressable
          key={tab.label}
          accessibilityRole="button"
          accessibilityLabel={tab.label}
          onPress={() =>
            router.navigate({
              pathname: tab.path,
              params: bookingId ? { bookingId } : {},
            })
          }
          style={s.tab}
        >
          <Icon
            name={tab.icon}
            size={21}
            color={i === 0 ? c.blue : "#97A7BE"}
          />
          <Text style={[s.tabLabel, i === 0 && { color: c.blue }]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function BookingUnavailable({
  loading,
  error,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <Screen>
      <Header title="Your Booking" fallback="/(booking)/home" />
      <Content>
        {loading ? (
          <ActivityIndicator color={c.blue} />
        ) : (
          <>
            <ErrorText>{error || "Booking could not be loaded."}</ErrorText>
            <Button title="Retry" onPress={onRetry} />
          </>
        )}
      </Content>
    </Screen>
  );
}

export const common = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  body: { color: c.text, fontSize: 14, lineHeight: 21 },
  muted: { color: c.muted, fontSize: 13, lineHeight: 20 },
  divider: { height: 1, backgroundColor: c.border, marginVertical: 13 },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.background },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: c.background,
  },
  flex: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chatHeader: { backgroundColor: c.white },
  headerRow: { flexDirection: "row", alignItems: "center", minHeight: 48 },
  iconHit: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
  },
  title: {
    flex: 1,
    color: c.text,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 3,
  },
  subtitle: { marginLeft: 9, marginBottom: 8, color: "#647B9B", fontSize: 13 },
  content: { padding: 16, flexGrow: 1 },
  card: {
    backgroundColor: c.white,
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: c.border,
    boxShadow: "0px 5px 12px rgba(23,32,51,0.035)",
  },
  button: {
    backgroundColor: c.blue,
    minHeight: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    boxShadow: "0px 5px 10px rgba(36,99,245,0.16)",
  },
  buttonText: { color: c.white, fontSize: 14, fontWeight: "600" },
  secondary: {
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
    boxShadow: "none",
  },
  secondaryText: { color: c.text },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  actions: {
    padding: 14,
    gap: 10,
    backgroundColor: c.white,
    borderTopWidth: 1,
    borderColor: c.border,
  },
  label: { fontSize: 14, fontWeight: "700", color: c.text, marginBottom: 12 },
  field: { flex: 1, gap: 7 },
  fieldLabel: { color: c.text, fontSize: 12, fontWeight: "600" },
  input: {
    backgroundColor: c.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    minHeight: 46,
    paddingHorizontal: 12,
    color: c.text,
    fontSize: 13,
  },
  error: { color: c.danger, fontSize: 13, lineHeight: 19, marginVertical: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: c.paleBlue,
  },
  largeAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: c.white,
  },
  nav: {
    flexDirection: "row",
    backgroundColor: c.white,
    borderTopWidth: 1,
    borderColor: c.border,
    paddingTop: 8,
    paddingBottom: 6,
  },
  tab: { flex: 1, alignItems: "center", gap: 4, minHeight: 46 },
  tabLabel: { color: "#97A7BE", fontSize: 10 },
});
