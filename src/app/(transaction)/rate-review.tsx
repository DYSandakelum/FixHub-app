import { useState } from "react";
import { router } from "expo-router";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Actions,
  Avatar,
  BookingUnavailable,
  Button,
  Content,
  ErrorText,
  Header,
  Icon,
  Screen,
} from "@/components/transaction/ui";
import { feedbackTags, transactionColors as c } from "@/constants/transaction";
import { useTransaction } from "@/hooks/use-transaction";

export default function RateReviewScreen() {
  const tx = useTransaction();
  const [draft, setDraft] = useState<{
    rating: number;
    comment: string;
    tags: string[];
  } | null>(null);
  const rating = draft?.rating ?? tx.review?.rating ?? 4;
  const comment = draft?.comment ?? tx.review?.comment ?? "";
  const tags = draft?.tags ?? tx.review?.tags ?? [];
  const edit = (patch: Partial<NonNullable<typeof draft>>) =>
    setDraft({ rating, comment, tags, ...patch });
  const setRating = (value: number) => edit({ rating: value });
  const setComment = (value: string) => edit({ comment: value });
  const setTags = (update: (previous: string[]) => string[]) =>
    edit({ tags: update(tags) });
  const [options, setOptions] = useState(false);
  const [saved, setSaved] = useState(false);
  const [validation, setValidation] = useState("");
  async function submit() {
    setValidation("");
    if (!tx.isDemo && tx.booking.status !== "Completed") {
      setValidation(
        "You can leave feedback when your provider completes the service.",
      );
      return;
    }
    if (await tx.saveReview({ rating, comment: comment.trim(), tags })) {
      setDraft(null);
      setSaved(true);
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
      <Header title="Rate & Review" onMore={() => setOptions(true)} />
      <Content>
        <View style={s.profile}>
          <Avatar large />
          <Text style={s.name}>
            {tx.isDemo ? "Marcus Vance" : tx.booking.providerName}
          </Text>
          <Text style={s.speciality}>Expert Plumbing Technician</Text>
        </View>
        <Text style={s.question}>How would you rate his service?</Text>
        <View style={s.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              accessibilityRole="radio"
              accessibilityLabel={`${star} star${star > 1 ? "s" : ""}`}
              accessibilityState={{ checked: rating === star }}
              onPress={() => setRating(star)}
              style={s.starHit}
            >
              <View style={[s.star, star <= rating && s.starSelected]}>
                <Icon
                  name="star-outline"
                  size={23}
                  color={star <= rating ? c.white : "#A8B2BF"}
                />
              </View>
            </Pressable>
          ))}
        </View>
        <Text style={s.label}>Leave a written review (optional)</Text>
        <TextInput
          accessibilityLabel="Written review"
          multiline
          textAlignVertical="top"
          placeholder={`Describe your experience with ${tx.isDemo ? "Marcus" : tx.booking.providerName.split(" ")[0]}...`}
          placeholderTextColor="#A9ADB4"
          value={comment}
          onChangeText={setComment}
          maxLength={2000}
          style={s.review}
        />
        <Text style={[s.label, s.tagsLabel]}>What went well?</Text>
        <View style={s.tags}>
          {feedbackTags.map((tag) => (
            <Pressable
              key={tag}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: tags.includes(tag) }}
              onPress={() =>
                setTags((previous) =>
                  previous.includes(tag)
                    ? previous.filter((t) => t !== tag)
                    : [...previous, tag],
                )
              }
              style={[s.tag, tags.includes(tag) && s.selectedTag]}
            >
              <Text
                style={[s.tagText, tags.includes(tag) && s.selectedTagText]}
              >
                {tag}
              </Text>
            </Pressable>
          ))}
        </View>
        <ErrorText>{validation || tx.error}</ErrorText>
      </Content>
      <Actions>
        <Button
          title={tx.review ? "Update Feedback" : "Submit Feedback"}
          busy={tx.busy}
          disabled={tx.loading || !tx.ready}
          onPress={() => {
            void submit();
          }}
        />
        <Button
          title="Skip"
          secondary
          onPress={() => router.navigate(tx.route("/booking-tracking"))}
        />
      </Actions>
      <Modal
        visible={saved || options}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSaved(false);
          setOptions(false);
        }}
      >
        <View style={s.overlay}>
          <View style={s.menu}>
            {saved ? (
              <>
                <Icon name="checkmark-circle-outline" size={46} />
                <Text style={s.menuTitle}>Thank you for your feedback!</Text>
                <Text style={s.help}>
                  Your review is saved. You can edit or remove it from this
                  screen.
                </Text>
                <Button
                  title="Back to Booking"
                  onPress={() => {
                    setSaved(false);
                    router.navigate(tx.route("/booking-tracking"));
                  }}
                />
              </>
            ) : (
              <>
                <Text style={s.menuTitle}>Review options</Text>
                {tx.review ? (
                  <>
                    <Text style={s.help}>
                      Deleting your review removes your rating and written
                      feedback.
                    </Text>
                    <Button
                      title="Delete Review"
                      busy={tx.busy}
                      onPress={() => {
                        void tx.deleteReview().then((ok) => {
                          if (ok) {
                            setDraft(null);
                            setOptions(false);
                          }
                        });
                      }}
                    />
                    <ErrorText>{tx.error}</ErrorText>
                  </>
                ) : (
                  <Text style={s.help}>
                    Submit feedback first. You can return here to edit or delete
                    it.
                  </Text>
                )}
                <Button
                  title="Close"
                  secondary
                  onPress={() => setOptions(false)}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  profile: { alignItems: "center", marginTop: 10, marginBottom: 26 },
  name: { marginTop: 15, fontWeight: "700", fontSize: 19, color: c.text },
  speciality: { marginTop: 4, fontSize: 13, color: "#8B8E95" },
  question: {
    color: c.text,
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
    marginTop: 6,
    marginBottom: 20,
  },
  starHit: {
    height: 44,
    width: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    height: 32,
    width: 32,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: c.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.white,
  },
  starSelected: { backgroundColor: c.blue, borderColor: c.blue },
  label: { fontWeight: "600", fontSize: 12, color: c.text, marginBottom: 9 },
  review: {
    height: 145,
    padding: 13,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
    borderRadius: 12,
    color: c.text,
    fontSize: 13,
    lineHeight: 20,
    boxShadow: "0px 3px 8px rgba(23,32,51,.025)",
  },
  tagsLabel: { marginTop: 28 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, maxWidth: 300 },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: c.paleBlue,
    borderWidth: 1,
    borderColor: c.paleBorder,
  },
  selectedTag: { backgroundColor: c.blue, borderColor: c.blue },
  tagText: { color: "#4B85C7", fontSize: 12 },
  selectedTagText: { color: c.white },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(23,32,51,.35)",
    padding: 24,
    justifyContent: "center",
  },
  menu: {
    backgroundColor: c.white,
    borderRadius: 20,
    padding: 24,
    gap: 14,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  menuTitle: { color: c.text, fontSize: 19, fontWeight: "700" },
  help: { color: c.muted, fontSize: 13, lineHeight: 20 },
});
