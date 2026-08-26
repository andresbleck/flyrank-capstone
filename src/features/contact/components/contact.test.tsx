import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Contact } from "@/features/contact/components/contact";

describe("Contact", () => {
  it("renders the page title and subtitle", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Contact" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Reach out or stop by the gym — we're happy to help."),
    ).toBeInTheDocument();
  });

  it("links the phone channel with a tel: href", () => {
    render(<Contact />);

    expect(
      screen.getByRole("link", { name: /\+54 381 400 1000/ }),
    ).toHaveAttribute("href", "tel:+543814001000");
  });

  it("gives the Instagram channel an accessible name and correct href", () => {
    render(<Contact />);

    expect(
      screen.getByRole("link", { name: "Follow FORGE on Instagram" }),
    ).toHaveAttribute("href", "https://instagram.com/forge.gym");
  });

  it("shows the hours channel as plain text, not a link", () => {
    render(<Contact />);

    expect(screen.getByText("6am – 10pm")).toBeInTheDocument();
    expect(screen.getByText("Monday to Saturday")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /6am – 10pm/ }),
    ).not.toBeInTheDocument();
  });

  it("shows the gym location as plain text, not a link", () => {
    render(<Contact />);

    expect(screen.getByText("Tucumán, Argentina")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Tucumán, Argentina/ }),
    ).not.toBeInTheDocument();
  });

  it("renders the contact form", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Or send us a message" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders the Locations heading and all three location cards", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Locations" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Tucumán Centro")).toBeInTheDocument();
    expect(screen.getByText("Córdoba 742")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "+54 381 421 5590" }),
    ).toHaveAttribute("href", "tel:+543814215590");

    expect(screen.getByText("Tucumán Norte")).toBeInTheDocument();
    expect(screen.getByText("Corrientes 1350")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "+54 381 452 7788" }),
    ).toHaveAttribute("href", "tel:+543814527788");

    expect(screen.getByText("Tucumán Sur")).toBeInTheDocument();
    expect(screen.getByText("Av. Roca 3820")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "+54 381 480 6612" }),
    ).toHaveAttribute("href", "tel:+543814806612");
  });

  it("embeds a Google Maps iframe for each location", () => {
    render(<Contact />);

    const centroMap = screen.getByTitle("Map showing Tucumán Centro");
    expect(centroMap.tagName).toBe("IFRAME");
    expect(centroMap).toHaveAttribute(
      "src",
      "https://www.google.com/maps?q=C%C3%B3rdoba%20742%2C%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Argentina&output=embed",
    );
  });

  it("renders the FAQ section", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { level: 2, name: "FAQ" }),
    ).toBeInTheDocument();
  });
});
