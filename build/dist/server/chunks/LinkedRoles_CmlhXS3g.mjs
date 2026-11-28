import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Base, b as $$InlineIcon } from './Base_Di2YHjFe.mjs';
/* empty css                                */

const $$Astro = createAstro("https://petto.sbs");
const $$LinkedRoles = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LinkedRoles;
  const { lang = "en" } = Astro2.props;
  const status = Astro2.url.searchParams.get("status");
  const error = Astro2.url.searchParams.get("error");
  const copy = {
    en: {
      title: "Linked roles \xB7 Petto",
      description: "Connect your Petto account to Discord and unlock Petto Verified in servers that use linked roles.",
      eyebrow: "Discord connection",
      heading: "A small role that says you are connected.",
      lede: "Link your Discord account to Petto through petto.sbs. Once the connection is complete, Discord can grant the Petto Verified role in participating servers.",
      connect: "Connect with Discord",
      connected: "Connection complete",
      connectedText: "Your Petto connection was updated. Return to Discord to finish receiving the role.",
      errorTitle: "We could not finish the connection",
      errors: {
        missing_config: "Linked roles are not configured on this environment yet.",
        invalid_state: "The verification session expired. Start the connection again.",
        access_denied: "Discord did not authorize the connection.",
        token_exchange_failed: "Discord could not exchange the connection code.",
        user_fetch_failed: "Petto could not read your Discord profile.",
        connection_update_failed: "Petto could not update your Discord connection.",
        invalid_request: "The verification request was incomplete.",
        generic: "Something went wrong. Try again in a moment."
      },
      serverTitle: "For server admins",
      serverText: "Create a role, open its Links tab, and add Petto as a requirement. We recommend naming the role Petto Verified so members know what it represents.",
      previewAria: "Petto Verified role flow",
      previewConnection: "Connected through",
      previewService: "Discord connection",
      previewRequirement: "Role requirement met",
      howEyebrow: "How it works",
      howTitle: "Three quick steps.",
      steps: [
        ["01", "Connect", "Authorize Petto with Discord."],
        ["02", "Verify", "Petto records the connection on your Discord profile."],
        ["03", "Receive", "Discord checks the requirement and grants the role."]
      ],
      note: "This connection is separate from Petto Premium. It identifies a connected Petto account; it does not grant paid features."
    },
    es: {
      title: "Roles vinculados \xB7 Petto",
      description: "Conecta tu cuenta de Petto con Discord y desbloquea Petto Verified en servidores que usen roles vinculados.",
      eyebrow: "Conexi\xF3n de Discord",
      heading: "Un rol peque\xF1o que demuestra que est\xE1s conectado.",
      lede: "Vincula tu cuenta de Discord con Petto mediante petto.sbs. Cuando termine la conexi\xF3n, Discord podr\xE1 darte el rol Petto Verified en los servidores participantes.",
      connect: "Conectar con Discord",
      connected: "Conexi\xF3n completada",
      connectedText: "Tu conexi\xF3n con Petto se actualiz\xF3. Regresa a Discord para terminar de recibir el rol.",
      errorTitle: "No pudimos terminar la conexi\xF3n",
      errors: {
        missing_config: "Los roles vinculados todav\xEDa no est\xE1n configurados en este entorno.",
        invalid_state: "La sesi\xF3n de verificaci\xF3n expir\xF3. Inicia la conexi\xF3n otra vez.",
        access_denied: "Discord no autoriz\xF3 la conexi\xF3n.",
        token_exchange_failed: "Discord no pudo intercambiar el c\xF3digo de conexi\xF3n.",
        user_fetch_failed: "Petto no pudo leer tu perfil de Discord.",
        connection_update_failed: "Petto no pudo actualizar tu conexi\xF3n de Discord.",
        invalid_request: "La solicitud de verificaci\xF3n estaba incompleta.",
        generic: "Algo sali\xF3 mal. Int\xE9ntalo de nuevo en un momento."
      },
      serverTitle: "Para administradores",
      serverText: "Crea un rol, abre la pesta\xF1a Links y agrega Petto como requisito. Recomendamos llamarlo Petto Verified para que todos sepan qu\xE9 representa.",
      previewAria: "Flujo del rol Petto Verified",
      previewConnection: "Conectado mediante",
      previewService: "Conexi\xF3n de Discord",
      previewRequirement: "Requisito del rol cumplido",
      howEyebrow: "C\xF3mo funciona",
      howTitle: "Tres pasos r\xE1pidos.",
      steps: [
        ["01", "Conecta", "Autoriza Petto con Discord."],
        ["02", "Verifica", "Petto guarda la conexi\xF3n en tu perfil de Discord."],
        ["03", "Recibe", "Discord comprueba el requisito y entrega el rol."]
      ],
      note: "Esta conexi\xF3n es independiente de Petto Premium. Identifica una cuenta conectada a Petto; no concede funciones de pago."
    },
    "pt-BR": {
      title: "Cargos vinculados \xB7 Petto",
      description: "Conecte sua conta Petto ao Discord e desbloqueie o Petto Verified em servidores que usam cargos vinculados.",
      eyebrow: "Conex\xE3o do Discord",
      heading: "Um cargo pequeno que mostra que voc\xEA est\xE1 conectado.",
      lede: "Vincule sua conta do Discord ao Petto pelo petto.sbs. Quando a conex\xE3o terminar, o Discord poder\xE1 conceder o cargo Petto Verified nos servidores participantes.",
      connect: "Conectar com o Discord",
      connected: "Conex\xE3o conclu\xEDda",
      connectedText: "Sua conex\xE3o com o Petto foi atualizada. Volte ao Discord para terminar de receber o cargo.",
      errorTitle: "N\xE3o foi poss\xEDvel concluir a conex\xE3o",
      errors: {
        missing_config: "Os cargos vinculados ainda n\xE3o est\xE3o configurados neste ambiente.",
        invalid_state: "A sess\xE3o de verifica\xE7\xE3o expirou. Comece a conex\xE3o novamente.",
        access_denied: "O Discord n\xE3o autorizou a conex\xE3o.",
        token_exchange_failed: "O Discord n\xE3o conseguiu trocar o c\xF3digo de conex\xE3o.",
        user_fetch_failed: "O Petto n\xE3o conseguiu ler seu perfil do Discord.",
        connection_update_failed: "O Petto n\xE3o conseguiu atualizar sua conex\xE3o do Discord.",
        invalid_request: "A solicita\xE7\xE3o de verifica\xE7\xE3o estava incompleta.",
        generic: "Algo deu errado. Tente novamente em instantes."
      },
      serverTitle: "Para administradores",
      serverText: "Crie um cargo, abra a aba Links e adicione o Petto como requisito. Recomendamos o nome Petto Verified para deixar claro o que ele representa.",
      previewAria: "Fluxo do cargo Petto Verified",
      previewConnection: "Conectado pelo",
      previewService: "Conex\xE3o do Discord",
      previewRequirement: "Requisito do cargo atendido",
      howEyebrow: "Como funciona",
      howTitle: "Tr\xEAs passos r\xE1pidos.",
      steps: [
        ["01", "Conecte", "Autorize o Petto com o Discord."],
        ["02", "Verifique", "O Petto registra a conex\xE3o no seu perfil do Discord."],
        ["03", "Receba", "O Discord confere o requisito e concede o cargo."]
      ],
      note: "Esta conex\xE3o \xE9 separada do Petto Premium. Ela identifica uma conta conectada ao Petto; n\xE3o concede recursos pagos."
    }
  }[lang];
  const errorMessage = error ? copy.errors[error] ?? copy.errors.generic : null;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": copy.title, "description": copy.description, "lang": lang, "showFooter": true, "data-astro-cid-4l3ldswu": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="linked-page" data-astro-cid-4l3ldswu> <section class="linked-hero wrap" data-astro-cid-4l3ldswu> <div class="linked-copy" data-astro-cid-4l3ldswu> <p class="eyebrow" data-astro-cid-4l3ldswu>${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:link-fill", "width": "14", "height": "14", "data-astro-cid-4l3ldswu": true })} ${copy.eyebrow}</p> <h1 data-astro-cid-4l3ldswu>${copy.heading}</h1> <p class="linked-lede" data-astro-cid-4l3ldswu>${copy.lede}</p> ${status === "connected" ? renderTemplate`<div class="linked-alert linked-success" role="status" data-astro-cid-4l3ldswu> ${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:check-circle-fill", "width": "19", "height": "19", "data-astro-cid-4l3ldswu": true })} <div data-astro-cid-4l3ldswu><strong data-astro-cid-4l3ldswu>${copy.connected}</strong><span data-astro-cid-4l3ldswu>${copy.connectedText}</span></div> </div>` : errorMessage ? renderTemplate`<div class="linked-alert linked-error" role="alert" data-astro-cid-4l3ldswu> ${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:warning-fill", "width": "19", "height": "19", "data-astro-cid-4l3ldswu": true })} <div data-astro-cid-4l3ldswu><strong data-astro-cid-4l3ldswu>${copy.errorTitle}</strong><span data-astro-cid-4l3ldswu>${errorMessage}</span></div> </div>` : null} ${status !== "connected" && renderTemplate`<a class="btn btn-accent linked-cta" href="/linked-roles/start" data-astro-cid-4l3ldswu>${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "simple-icons:discord", "width": "17", "height": "17", "data-astro-cid-4l3ldswu": true })} ${copy.connect}</a>`} <p class="linked-note" data-astro-cid-4l3ldswu>${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:info-fill", "width": "14", "height": "14", "data-astro-cid-4l3ldswu": true })} ${copy.note}</p> </div> <div class="linked-card linked-preview"${addAttribute(copy.previewAria, "aria-label")} data-astro-cid-4l3ldswu> <div class="linked-card-top" data-astro-cid-4l3ldswu><span class="linked-status-dot" data-astro-cid-4l3ldswu></span><span data-astro-cid-4l3ldswu>petto.sbs</span><span class="linked-card-top-muted" data-astro-cid-4l3ldswu>${copy.previewService}</span></div> <div class="linked-role-icon" data-astro-cid-4l3ldswu>${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:seal-check-fill", "width": "25", "height": "25", "data-astro-cid-4l3ldswu": true })}</div> <h2 data-astro-cid-4l3ldswu>Petto Verified</h2> <p data-astro-cid-4l3ldswu>${copy.previewConnection} <b data-astro-cid-4l3ldswu>Petto</b></p> <div class="linked-chip" data-astro-cid-4l3ldswu>${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-4l3ldswu": true })} ${copy.previewRequirement}</div> </div> </section> <section class="linked-section wrap" data-astro-cid-4l3ldswu> <div class="linked-section-heading" data-astro-cid-4l3ldswu><p class="eyebrow" data-astro-cid-4l3ldswu>${copy.howEyebrow}</p><h2 data-astro-cid-4l3ldswu>${copy.howTitle}</h2></div> <div class="linked-steps" data-astro-cid-4l3ldswu> ${copy.steps.map(([number, title, text]) => renderTemplate`<article class="linked-step" data-astro-cid-4l3ldswu><span data-astro-cid-4l3ldswu>${number}</span><h3 data-astro-cid-4l3ldswu>${title}</h3><p data-astro-cid-4l3ldswu>${text}</p></article>`)} </div> </section> <section class="linked-admin wrap" data-astro-cid-4l3ldswu> <div class="linked-admin-icon" data-astro-cid-4l3ldswu>${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:gear-six-fill", "width": "20", "height": "20", "data-astro-cid-4l3ldswu": true })}</div> <div data-astro-cid-4l3ldswu><p class="eyebrow" data-astro-cid-4l3ldswu>${copy.serverTitle}</p><p data-astro-cid-4l3ldswu>${copy.serverText}</p></div> </section> </main> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/LinkedRoles.astro", void 0);

export { $$LinkedRoles as $ };
