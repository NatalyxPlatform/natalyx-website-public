// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClinicInterestForm } from "@/components/clinic-interest/ClinicInterestForm";

const VALID = {
  clinic_name: "Bayview Fertility Center",
  contact_name: "Dana Reyes",
  work_email: "dana.reyes@bayview.example",
  phone: "+1 415 555 0142",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

const WEB3FORMS = "https://api.web3forms.com/submit";

/** Server accepts and asks the browser to relay; Web3Forms accepts the relay. */
function twoStepSuccess() {
  return vi.fn(async (url: string) =>
    url === WEB3FORMS
      ? jsonResponse({ success: true })
      : jsonResponse({ ok: true, forward: { work_email: VALID.work_email } })
  );
}

beforeEach(() => {
  fetchMock = vi.fn(async () => jsonResponse({ ok: true }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/clinic name/i), VALID.clinic_name);
  await user.type(screen.getByLabelText(/your name/i), VALID.contact_name);
  await user.type(screen.getByLabelText(/work email/i), VALID.work_email);
  await user.type(screen.getByLabelText(/phone number/i), VALID.phone);
  await user.click(screen.getByRole("checkbox"));
}

function submitButton() {
  return screen.getByRole("button", {
    name: /register your clinic's interest/i,
  });
}

describe("clinic interest form — the fields it asks for", () => {
  it("collects exactly the four clinic fields", () => {
    render(<ClinicInterestForm />);
    const form = screen.getByRole("form", {
      name: /register your clinic's interest/i,
    });
    const visibleTextInputs = within(form)
      .getAllByRole("textbox")
      .filter((el) => el.getAttribute("name") !== "website_url");

    expect(visibleTextInputs.map((el) => el.id)).toEqual([
      "clinic_name",
      "contact_name",
      "work_email",
      "phone",
    ]);
  });

  it("gives each field a real label rather than a placeholder", () => {
    render(<ClinicInterestForm />);
    for (const [id, label] of [
      ["clinic_name", "Clinic name"],
      ["contact_name", "Your name"],
      ["work_email", "Work email"],
      ["phone", "Phone number"],
    ]) {
      const field = document.getElementById(id) as HTMLInputElement;
      const labelEl = document.querySelector(`label[for="${id}"]`);
      expect(labelEl?.textContent).toContain(label);
      expect(field.getAttribute("placeholder")).toBeNull();
    }
  });

  it("uses the expected input semantics and autocomplete tokens", () => {
    render(<ClinicInterestForm />);
    const expected: [string, string, string][] = [
      ["clinic_name", "text", "organization"],
      ["contact_name", "text", "name"],
      ["work_email", "email", "email"],
      ["phone", "tel", "tel"],
    ];
    for (const [id, type, autocomplete] of expected) {
      const field = document.getElementById(id) as HTMLInputElement;
      expect(field.type).toBe(type);
      expect(field.getAttribute("autocomplete")).toBe(autocomplete);
    }
  });

  it("asks nothing about participant role", () => {
    render(<ClinicInterestForm />);
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(document.querySelector("select")).toBeNull();
    expect(document.getElementById("role")).toBeNull();
    expect(document.body.textContent).not.toMatch(
      /intended parent|gestational carrier|surrogate|donor/i
    );
  });

  it("offers no free-text field that could invite case or health detail", () => {
    render(<ClinicInterestForm />);
    expect(document.querySelector("textarea")).toBeNull();
    expect(document.body.textContent).not.toMatch(
      /diagnosis|medical history|patient name|date of birth/i
    );
  });

  it("tells the visitor not to send patient information", () => {
    render(<ClinicInterestForm />);
    expect(document.body.textContent).toMatch(
      /do not include patient, medical, legal, or case information/i
    );
  });
});

describe("clinic interest form — client refusals", () => {
  it("refuses an empty submission, names all four fields, and sends nothing", async () => {
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await user.click(submitButton());

    expect(await screen.findByText("Clinic name is required")).toBeVisible();
    expect(screen.getByText("Your name is required")).toBeVisible();
    expect(screen.getByText("Work email is required")).toBeVisible();
    expect(screen.getByText("Phone number is required")).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("moves focus to the first invalid field", async () => {
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await user.click(submitButton());
    await waitFor(() =>
      expect(document.activeElement?.id).toBe("clinic_name")
    );
  });

  it.each([
    ["clinic name", /clinic name/i, "Clinic name is required"],
    ["contact name", /your name/i, "Your name is required"],
    ["work email", /work email/i, "Work email is required"],
    ["phone", /phone number/i, "Phone number is required"],
  ])(
    "refuses a submission with only %s missing",
    async (_name, labelPattern, message) => {
      const user = userEvent.setup();
      render(<ClinicInterestForm />);
      await fillValidForm(user);
      await user.clear(screen.getByLabelText(labelPattern));
      await user.click(submitButton());

      expect(await screen.findByText(message)).toBeVisible();
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it("refuses a submission without the consent checkbox", async () => {
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await user.type(screen.getByLabelText(/clinic name/i), VALID.clinic_name);
    await user.type(screen.getByLabelText(/your name/i), VALID.contact_name);
    await user.type(screen.getByLabelText(/work email/i), VALID.work_email);
    await user.type(screen.getByLabelText(/phone number/i), VALID.phone);
    await user.click(submitButton());

    expect(
      await screen.findByText("Please confirm we may contact your clinic")
    ).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["nope", "a@b", "dana@"])(
    "refuses invalid email %j before any request",
    async (email) => {
      const user = userEvent.setup();
      render(<ClinicInterestForm />);
      await fillValidForm(user);
      await user.clear(screen.getByLabelText(/work email/i));
      await user.type(screen.getByLabelText(/work email/i), email);
      await user.click(submitButton());

      expect(
        await screen.findByText("Enter a valid work email address")
      ).toBeVisible();
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it.each(["12", "abcdefg"])(
    "refuses unusable phone %j before any request",
    async (phone) => {
      const user = userEvent.setup();
      render(<ClinicInterestForm />);
      await fillValidForm(user);
      await user.clear(screen.getByLabelText(/phone number/i));
      await user.type(screen.getByLabelText(/phone number/i), phone);
      await user.click(submitButton());

      expect(
        await screen.findByText(/Enter a phone number/i)
      ).toBeVisible();
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );
});

describe("clinic interest form — submission", () => {
  it("posts exactly the clinic fields to the clinic-interest endpoint", async () => {
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/clinic-interest");
    expect(init.method).toBe("POST");

    const body = JSON.parse(init.body as string);
    expect(Object.keys(body).sort()).toEqual([
      "clinic_name",
      "consent_to_contact",
      "contact_name",
      "phone",
      "website_url",
      "work_email",
    ]);
    for (const retired of [
      "role",
      "role_value",
      "journey_stage",
      "preferred_contact",
      "notes",
      "country",
      "region",
    ]) {
      expect(body).not.toHaveProperty(retired);
    }
  });

  it("shows a receipt-only success state", async () => {
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(/we have your clinic's interest/i);
  });

  it("does not echo the submitted contact details back", async () => {
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    await screen.findByRole("status");
    const text = document.body.textContent ?? "";
    expect(text).not.toContain(VALID.work_email);
    expect(text).not.toContain(VALID.phone);
    expect(text).not.toContain(VALID.clinic_name);
    expect(text).not.toContain(VALID.contact_name);
  });

  it("promises no acceptance, onboarding, partnership or response time", async () => {
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    await screen.findByRole("status");
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/within \d+ (hours|business days|days)/i);
    expect(text).not.toMatch(/we will (call|respond|reply) (you )?(within|in)/i);
    expect(text).not.toMatch(/you are now a partner|onboarding will begin/i);
    expect(text).not.toMatch(/accepted|approved/i);
  });
});

describe("clinic interest form — relaying to Web3Forms from the browser", () => {
  it("posts to Web3Forms after the server validates", async () => {
    fetchMock.mockImplementation(twoStepSuccess());
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    await screen.findByRole("status");
    const urls = fetchMock.mock.calls.map((c) => c[0]);
    expect(urls).toEqual(["/api/clinic-interest", WEB3FORMS]);
  });

  it("relays the server's payload verbatim, plus the access key", async () => {
    fetchMock.mockImplementation(twoStepSuccess());
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());
    await screen.findByRole("status");

    const relay = JSON.parse(
      (fetchMock.mock.calls[1][1] as RequestInit).body as string
    );
    expect(relay.access_key).toBeTruthy();
    expect(relay.work_email).toBe(VALID.work_email);
    // Web3Forms uses `email` as the reply-to address.
    expect(relay.email).toBe(VALID.work_email);
  });

  it("skips Web3Forms entirely when the server forwards nothing", async () => {
    // Honeypot hit, or log mode: the server handled it, nothing should be sent.
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    await screen.findByRole("status");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/clinic-interest");
  });

  it.each([
    ["Web3Forms returns success:false", () => jsonResponse({ success: false })],
    ["Web3Forms returns 403", () => jsonResponse({ success: false }, 403)],
    ["Web3Forms returns an unparseable body", () => new Response("nope")],
  ])("shows an error, not success, when %s", async (_label, respond) => {
    fetchMock.mockImplementation(async (url: string) =>
      url === WEB3FORMS
        ? respond()
        : jsonResponse({ ok: true, forward: { work_email: VALID.work_email } })
    );
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toBeVisible();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("shows an error, not success, when the Web3Forms request throws", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url === WEB3FORMS) throw new TypeError("network down");
      return jsonResponse({ ok: true, forward: { work_email: VALID.work_email } });
    });
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toBeVisible();
    expect(screen.queryByRole("status")).toBeNull();
  });
});

describe("clinic interest form — a failed submission never looks successful", () => {
  it.each([
    ["a 500 response", () => jsonResponse({ ok: false, error: "nope" }, 500)],
    ["a 502 response", () => jsonResponse({ ok: false, error: "nope" }, 502)],
    ["a 429 response", () => jsonResponse({ ok: false, error: "slow down" }, 429)],
    ["an empty 200 body", () => new Response("", { status: 200 })],
    ["a 200 carrying ok:false", () => jsonResponse({ ok: false, error: "nope" })],
    ["a 200 carrying no ok flag", () => jsonResponse({ message: "sent" })],
  ])("renders an error, not success, for %s", async (_label, respond) => {
    fetchMock.mockResolvedValue(respond());
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toBeVisible();
    expect(screen.queryByRole("status")).toBeNull();
    expect(
      screen.queryByText(/we have your clinic's interest/i)
    ).toBeNull();
  });

  it("renders an error, not success, when the request throws", async () => {
    fetchMock.mockRejectedValue(new TypeError("network down"));
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /unable to submit/i
    );
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("keeps what the visitor typed so they can retry", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: false, error: "nope" }, 500));
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    await screen.findByRole("alert");
    expect(screen.getByLabelText(/clinic name/i)).toHaveValue(VALID.clinic_name);
    expect(screen.getByLabelText(/work email/i)).toHaveValue(VALID.work_email);
  });

  it("surfaces server field errors on the right fields", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          ok: false,
          error: "Please correct the highlighted fields.",
          fieldErrors: { work_email: "Enter a valid work email address" },
        },
        400
      )
    );
    const user = userEvent.setup();
    render(<ClinicInterestForm />);
    await fillValidForm(user);
    await user.click(submitButton());

    expect(
      await screen.findByText("Enter a valid work email address")
    ).toBeVisible();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
