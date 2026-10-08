export const transactionColors = {
  blue: "#2463F5",
  background: "#F6F9FD",
  white: "#FFFFFF",
  text: "#172033",
  muted: "#748198",
  border: "#E7EDF5",
  paleBlue: "#EFF6FF",
  paleBorder: "#CCDEFF",
  danger: "#C33546",
};

export const bookingStages = [
  "Confirmed",
  "En Route",
  "Arrived",
  "In Progress",
  "Completed",
] as const;
export type BookingStage = (typeof bookingStages)[number];
export type PaymentMethod =
  "Cash on Delivery" | "Card Payment" | "Bank Transfer";
export const feedbackTags = [
  "Punctual",
  "Professional",
  "Clean Work",
  "Fair Price",
];
