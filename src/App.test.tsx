import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the destination story workspace", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "A Day in Painted Light" })).toBeInTheDocument();
    expect(screen.getByLabelText("Story controls")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate story/i })).toBeInTheDocument();
  });

  it("changes active story cards with keyboard reachable buttons", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Bapu Bazaar/i }));
    expect(screen.getByRole("heading", { name: "Threads That Remember Hands" })).toBeInTheDocument();
  });
});
