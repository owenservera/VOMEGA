// Developer product-twin renderer (D1-042..048).
// renderHtml is a pure function of a Projection (no language parsing, no
// private routing state). Clicking a chooser option must dispatch the option's
// `action` exactly as given in the projection. Every page must show SIMULATED.
import type { Projection, RouteSlot } from "./contract.ts";

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** The projection's label is shown as given; an empty slot says so instead of inventing a value. */
function routePart(name: string, slot: RouteSlot): string {
  const value = slot.label ?? (slot.state === "unresolved" ? "unresolved" : "none");
  return `<div class="route-part" data-slot="${esc(name.toLowerCase())}" data-state="${esc(slot.state)}"><span class="route-label">${esc(name)}</span> <span class="route-value">${esc(value)}</span></div>`;
}

export function renderHtml(p: Projection): string {
  const route = [
    routePart("Capability", p.route.capability),
    routePart("Provider", p.route.provider),
    routePart("Account", p.route.account),
    routePart("Model", p.route.model),
    routePart("Realization", p.route.realization),
  ].join("\n");

  // Options are offered side by side with no default: the projection's action is
  // carried verbatim, and nothing is pre-chosen for the user.
  const choosers = p.unresolved
    .map((u) => {
      const options = u.options
        .map((o) => `<button type="button" class="option" data-id="${esc(o.id)}" data-action="${esc(JSON.stringify(o.action))}">${esc(o.label)}</button>`)
        .join("");
      return `<fieldset class="unresolved" data-field="${esc(u.field)}"><legend>${esc(u.field)}: ${esc(u.reason)}</legend>${options}</fieldset>`;
    })
    .join("\n");

  const c = p.consequence;
  const consequence = !c
    ? ""
    : c.crossesLocalBoundary
      ? `<p class="consequence">This command crosses the local boundary: ${esc(c.carries.join(", "))} would be sent to ${esc(c.to ?? "an unresolved Provider")}.</p>`
      : `<p class="consequence">This command stays on this machine; nothing is transferred.</p>`;

  const actions = p.actions
    .map((a) => `<button type="button" class="action" data-action="${esc(JSON.stringify(a))}">${esc(a.type)}</button>`)
    .join("");

  return [
    `<!doctype html><html><head><meta charset="utf-8"><title>D1 twin · SIMULATED</title></head><body data-treatment="${esc(p.treatment)}">`,
    `<p class="evidence-class">Evidence class: ${esc(p.evidenceClass)}</p>`,
    `<label>Command <input type="text" name="input" value="${esc(p.input)}"></label>`,
    `<p class="reading">${esc(p.reading ?? "")}</p>`,
    `<p class="lifecycle">${esc(p.lifecycle)}</p>`,
    `<section class="route">${route}</section>`,
    choosers,
    consequence,
    actions ? `<div class="actions">${actions}</div>` : "",
    `</body></html>`,
  ].join("\n");
}
