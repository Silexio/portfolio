import { afterEach, describe, expect, it } from "vitest";
import { EMAIL } from "@/lib/data";
import { ownerAddress } from "@/lib/booking/mailer";

/**
 * Le repli est la seule chose qui sépare « une réservation arrive » de « une réservation est
 * enregistrée et personne ne le sait ». Une variable oubliée dans un nouvel environnement ne
 * produit aucune erreur : il faut donc qu'elle ne produise pas non plus de silence.
 */
describe("ownerAddress", () => {
  const initial = process.env.BOOKING_NOTIFY_EMAIL;
  afterEach(() => {
    process.env.BOOKING_NOTIFY_EMAIL = initial;
  });

  it("préfère l'adresse de notification quand elle est posée", () => {
    process.env.BOOKING_NOTIFY_EMAIL = "rdv@silexio.be";
    expect(ownerAddress()).toBe("rdv@silexio.be");
  });

  it("retombe sur l'adresse publique plutôt que sur personne", () => {
    Reflect.deleteProperty(process.env, "BOOKING_NOTIFY_EMAIL");
    expect(ownerAddress()).toBe(EMAIL);
    process.env.BOOKING_NOTIFY_EMAIL = "";
    expect(ownerAddress()).toBe(EMAIL);
  });
});
