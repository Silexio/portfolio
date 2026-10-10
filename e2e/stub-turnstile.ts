import type { Page } from "@playwright/test";

/** Jeton délivré tout de suite : aucun test ne dépend du réseau ni de Cloudflare. */
export const stubTurnstile = (page: Page) =>
  page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "window.turnstile={render:function(el,o){setTimeout(function(){o.callback('e2e-token')});return 'w'},reset:function(){},remove:function(){}};",
    }),
  );
