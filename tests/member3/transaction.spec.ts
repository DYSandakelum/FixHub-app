import { expect, test } from "@playwright/test";

test("payment validates inputs, records once, and preserves state across reload", async ({
  page,
}) => {
  await page.goto("/payment");
  await page.getByRole("button", { name: "Pay Now", exact: true }).click();
  await expect(
    page.getByText("Enter a 16-digit demo card number."),
  ).toBeVisible();
  await page
    .getByLabel("Card Number", { exact: true })
    .fill("4242424242424242");
  await page.getByLabel("Expiry Date", { exact: true }).fill("1230");
  await page.getByLabel("CVV", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Pay Now", exact: true }).click();
  await expect(page.getByText("Demo payment recorded")).toBeVisible();
  await page
    .getByRole("button", { name: "Track Booking", exact: true })
    .click();
  await expect(page.getByText("Booking Status", { exact: true })).toBeVisible();
  await page.goto("/payment");
  await expect(
    page.getByRole("button", { name: "View Booking", exact: true }),
  ).toBeVisible();
});

test("chat sends, survives reload, and deletes only the selected sent message", async ({
  page,
}) => {
  await page.goto("/chat");
  await expect(
    page.getByRole("button", { name: "Send message", exact: true }),
  ).toBeDisabled();
  await page
    .getByLabel("Type a message", { exact: true })
    .fill("Please use the side entrance.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText("Please use the side entrance.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  const message = page.getByText("Please use the side entrance.", {
    exact: true,
  });
  await expect(message).toBeVisible();
  await message.hover();
  await page.mouse.down();
  await page.waitForTimeout(600);
  await page.mouse.up();
  await page
    .getByRole("button", { name: "Delete Message", exact: true })
    .click();
  await expect(message).toHaveCount(0);
  await expect(
    page.getByText(
      "Hello! I am currently on my way to your location. I should arrive in about 10 minutes.",
      { exact: true },
    ),
  ).toBeVisible();
});

test("review can be created, edited, restored after reload, and removed", async ({
  page,
}) => {
  await page.goto("/rate-review");
  await page.getByRole("radio", { name: "5 stars", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Professional", exact: true })
    .click();
  await page
    .getByLabel("Written review", { exact: true })
    .fill("Very helpful and professional.");
  await page
    .getByRole("button", { name: "Submit Feedback", exact: true })
    .click();
  await expect(page.getByText("Thank you for your feedback!")).toBeVisible();
  await page.goto("/rate-review");
  await expect(page.getByLabel("Written review", { exact: true })).toHaveValue(
    "Very helpful and professional.",
  );
  await page
    .getByLabel("Written review", { exact: true })
    .fill("Updated review.");
  await page
    .getByRole("button", { name: "Update Feedback", exact: true })
    .click();
  await page.goto("/rate-review");
  await expect(page.getByLabel("Written review", { exact: true })).toHaveValue(
    "Updated review.",
  );
  await page.getByRole("button", { name: "More options", exact: true }).click();
  await page
    .getByRole("button", { name: "Delete Review", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Submit Feedback", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Written review", { exact: true })).toHaveValue(
    "",
  );
});

test("provider demo progression reaches review and screenshots render without overflow", async ({
  page,
}) => {
  await page.goto("/booking-tracking");
  for (let i = 0; i < 3; i++) {
    await page
      .getByRole("button", { name: "More options", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Advance Demo Status", exact: true })
      .click();
  }
  await expect(
    page.getByRole("button", { name: "Rate & Review", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "More options", exact: true }).click();
  await page.getByRole("button", { name: "Reset Demo", exact: true }).click();
  for (const route of ["payment", "booking-tracking", "chat", "rate-review"]) {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${route}`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("button").first()).toBeVisible();
    await page.screenshot({ path: `docs/member3-screenshots/${route}.png` });
    expect(errors).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/payment");
  await expect(
    page.getByRole("button", { name: "Pay Now", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("real booking errors never display demo data", async ({ page }) => {
  await page.goto("/payment?bookingId=00000000-0000-0000-0000-000000000001");
  await expect(
    page.getByRole("button", { name: "Retry", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Prasanna Perera", { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: "Pay Now", exact: true }),
  ).toHaveCount(0);
});
