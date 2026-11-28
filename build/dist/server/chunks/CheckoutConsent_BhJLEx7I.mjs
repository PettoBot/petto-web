import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                               */

const $$Astro = createAstro("https://petto.sbs");
const $$CheckoutConsent = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CheckoutConsent;
  const { lang } = Astro2.props;
  const copies = {
    en: { title: "Before you check out", intro: "Two documents govern this purchase. Please read both, then confirm below.", refunds: "purchase and refund terms", terms: "Terms of Service", agree: "I have read and agree to the", note: "You pay on Polar. Premium can be cancelled at any time, and payments are not refunded except for errors.", go: "Proceed to checkout", cancel: "Cancel", prefix: "" },
    es: { title: "Antes de pagar", intro: "Dos documentos rigen esta compra. L\xE9elos y confirma abajo.", refunds: "t\xE9rminos de compra y reembolso", terms: "T\xE9rminos del servicio", agree: "He le\xEDdo y acepto los", note: "Pagas en Polar. Premium se puede cancelar en cualquier momento, y los pagos no se reembolsan salvo errores.", go: "Continuar al pago", cancel: "Cancelar", prefix: "/es" },
    "pt-BR": { title: "Antes de pagar", intro: "Dois documentos regem esta compra. Leia e confirme abaixo.", refunds: "termos de compra e reembolso", terms: "Termos de Servi\xE7o", agree: "Li e concordo com os", note: "Voc\xEA paga na Polar. O Premium pode ser cancelado a qualquer momento, e os pagamentos n\xE3o s\xE3o reembolsados, exceto por erros.", go: "Continuar para o pagamento", cancel: "Cancelar", prefix: "/pt-br" }
  };
  const c = copies[lang] ?? copies.en;
  return renderTemplate`${maybeRenderHead()}<dialog class="pe-dialog" id="checkoutConsent" aria-labelledby="checkoutConsentTitle"> <form method="dialog" class="pe-dialog-body" id="checkoutConsentForm"> <h2 id="checkoutConsentTitle">${c.title}</h2> <p>${c.intro}</p> <label class="pe-check"><input type="checkbox" id="ccRefunds"><span>${c.agree} <a${addAttribute(`${c.prefix}/refunds`, "href")} target="_blank" rel="noopener">${c.refunds}</a>.</span></label> <label class="pe-check"><input type="checkbox" id="ccTerms"><span>${c.agree} <a${addAttribute(`${c.prefix}/terms`, "href")} target="_blank" rel="noopener">${c.terms}</a>.</span></label> <p class="pe-dialog-note">${c.note}</p> <button type="button" class="btn btn-accent pe-dialog-go" id="ccGo" disabled>${c.go}</button> <button type="button" class="btn btn-ghost pe-dialog-cancel" id="ccCancel">${c.cancel}</button> </form> </dialog>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/CheckoutConsent.astro", void 0);

export { $$CheckoutConsent as $ };
