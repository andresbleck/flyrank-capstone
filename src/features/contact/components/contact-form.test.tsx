import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ContactForm } from "@/features/contact/components/contact-form";

describe("ContactForm", () => {
  it("renders all fields and subject options", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toBeInTheDocument();

    for (const label of [
      "General inquiry",
      "Membership",
      "AI Coach support",
      "Other",
    ]) {
      expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
    }
  });

  it("shows validation errors and does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(
      screen.queryByText("Thanks for reaching out! We'll get back to you soon."),
    ).not.toBeInTheDocument();
  });

  it("shows an error when the email is invalid", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Andrés");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Message"), "Hi there");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(
      await screen.findByText("Enter a valid email address"),
    ).toBeInTheDocument();
  });

  it("submits successfully and moves focus to the success message", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Andrés");
    await user.type(screen.getByLabelText("Email"), "andres@example.com");
    await user.selectOptions(screen.getByLabelText("Subject"), "membership");
    await user.type(
      screen.getByLabelText("Message"),
      "I'd like more info about the Pro plan.",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    const successMessage = await screen.findByRole("status");
    expect(successMessage).toHaveTextContent(
      "Thanks for reaching out! We'll get back to you soon.",
    );
    expect(successMessage).toHaveFocus();
  });
});
