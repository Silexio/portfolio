import { describe, expect, it } from "vitest";
import { leadAckEmail, leadOwnerEmail } from "@/lib/leads/email";

const data = {
  task: "Recopier les PDF\ndans Excel <script>alert(1)</script>",
  hours: "3to10" as const,
  email: "patron@entreprise.be",
  source: "automation" as const,
  locale: "en" as const,
};

describe("leadOwnerEmail", () => {
  const mail = leadOwnerEmail(data);

  it("replies straight to the prospect", () => {
    expect(mail.replyTo).toBe("patron@entreprise.be");
  });

  it("names the page and the prospect in the subject", () => {
    expect(mail.subject).toContain("Automatisation");
    expect(mail.subject).toContain("patron@entreprise.be");
  });

  it("resolves the time range and the prospect's language", () => {
    expect(mail.text).toContain("3 à 10 heures");
    expect(mail.text).toContain("EN");
  });

  it("escapes the task and keeps its line breaks", () => {
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("&lt;script&gt;");
    expect(mail.html).toContain("Recopier les PDF<br>dans Excel");
  });

  it("omits the time range when the form did not ask for it", () => {
    expect(leadOwnerEmail({ ...data, hours: undefined }).text).not.toContain(
      "Temps perdu",
    );
  });
});

describe("leadAckEmail", () => {
  it("is localised and carries no placeholder", () => {
    const fr = leadAckEmail("fr");
    const en = leadAckEmail("en");
    expect(fr.subject).toContain("Bien reçu");
    expect(en.subject).toContain("Got it");
    expect(fr.text).not.toMatch(/\{\w+\}/);
    expect(en.text).not.toMatch(/\{\w+\}/);
  });
});
