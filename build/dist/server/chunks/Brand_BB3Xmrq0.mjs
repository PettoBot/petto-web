import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { $ as $$Base } from './Base_Di2YHjFe.mjs';
/* empty css                         */

const $$Astro = createAstro("https://petto.sbs");
const $$Brand = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Brand;
  const { lang } = Astro2.props;
  const copy = {
    en: {
      eyebrow: "Brand",
      title: "The Petto brand.",
      lede: "Everything you need to talk about Petto: the mascot, colors, fonts and a few simple rules. Free to use for articles, videos, bot lists and community posts.",
      logoTitle: "Mascot and versions",
      groups: [{ title: "Main", text: "The everyday mascot." }, { title: "Premium", text: "The crown marks Petto Premium. Use it only for Premium." }, { title: "Hat colors", text: "Same duck, other hat colors for themes and events." }, { title: "Banner", text: "For link previews and headers." }],
      names: { "mascot-icon": ["Mascot icon", "PNG"], "bot-avatar": ["Bot avatar", "PNG, as on Discord"], "duck-plain": ["Duck, plain", "PNG, no hat"], "duck-crown": ["Premium duck", "PNG, with crown"], "crown": ["Crown", "PNG, on its own"], "duck-bowl": ["Duck in a cup", "PNG"], "duck-bowl-crown": ["Premium duck in a cup", "PNG, with crown"], "duck-blue": ["Blue hat", "PNG"], "duck-green": ["Green hat", "PNG"], "duck-red": ["Pink hat", "PNG"], "banner": ["Link banner", "PNG, wide"] },
      kit: "Download everything (.zip)",
      moreTitle: "More versions (SVG)",
      moreNote: "SVG files for scaling. Only the crown is a true vector; the rest hold a high quality image inside.",
      moreNames: { "crown": "Crown", "duck-crown": "Premium duck", "duck-bowl": "Duck in a cup", "duck-bowl-crown": "Premium duck in a cup", "duck-plain": "Duck, no hat", "duck-hat-red": "Red hat", "duck-hat-pink": "Pink hat", "duck-hat-green": "Green hat", "duck-hat-peach": "Peach hat", "duck-hat-blue": "Blue hat", "duck-hat-wine": "Wine hat", "hat-blue": "Hat only, blue", "hat-wine": "Hat only, wine", "hat-green": "Hat only, green", "hat-pink": "Hat only, pink" },
      download: "Download",
      colorTitle: "Colors",
      colorText: "Click a color to copy its hex code.",
      copied: "Copied",
      colors: [
        { name: "Peach", hex: "#f0a88f", use: "Main accent" },
        { name: "Night", hex: "#111113", use: "Background" },
        { name: "Card", hex: "#1c1c20", use: "Surfaces" },
        { name: "Mint", hex: "#a5ea7a", use: "Success" },
        { name: "Yellow", hex: "#fed53c", use: "Warnings, the beak" },
        { name: "Coral", hex: "#fe6465", use: "Errors" }
      ],
      typeTitle: "Typography",
      typeText: "Fraunces for titles, Plus Jakarta Sans for everything else.",
      titleSample: "Fraunces",
      textSample: "Plus Jakarta Sans",
      aboutTitle: "About Petto",
      shortLabel: "Short description",
      short: "Petto is a Discord bot for moderation, logging, tickets, voice channels and more, with a clean dashboard.",
      longLabel: "Long description",
      long: "Petto is an all-in-one Discord bot that helps communities stay safe and organized. It brings moderation, logging, tickets, appeals, VoiceMaster, leveling and a full web dashboard together in one place, in English, Spanish and Portuguese.",
      copy: "Copy text",
      rulesTitle: "Do and do not",
      dos: ["Use the original files", "Keep clear space around the duck", 'Write the name as "Petto"', "Link to petto.sbs"],
      donts: ["Do not stretch, rotate or recolor the duck", "Do not add effects or shadows", "Do not imply Petto endorses your project", "Do not sell the assets"],
      contact: "Need something else, like a special size or a partnership?",
      support: "Open a support ticket"
    },
    es: {
      eyebrow: "Marca",
      title: "La marca de Petto.",
      lede: "Todo lo que necesitas para hablar de Petto: la mascota, los colores, las fuentes y unas pocas reglas simples. Es libre de usar en art\xEDculos, videos, listas de bots y publicaciones de comunidad.",
      logoTitle: "Mascota y versiones",
      groups: [{ title: "Principal", text: "La mascota de todos los d\xEDas." }, { title: "Premium", text: "La corona marca Petto Premium. \xDAsala solo para Premium." }, { title: "Colores de sombrero", text: "El mismo pato con otros colores de sombrero para temas y eventos." }, { title: "Banner", text: "Para vistas previas de enlaces y encabezados." }],
      names: { "mascot-icon": ["Icono de la mascota", "PNG"], "bot-avatar": ["Avatar del bot", "PNG, como en Discord"], "duck-plain": ["Pato simple", "PNG, sin sombrero"], "duck-crown": ["Pato Premium", "PNG, con corona"], "crown": ["Corona", "PNG, sola"], "duck-bowl": ["Pato en una taza", "PNG"], "duck-bowl-crown": ["Pato Premium en una taza", "PNG, con corona"], "duck-blue": ["Sombrero azul", "PNG"], "duck-green": ["Sombrero verde", "PNG"], "duck-red": ["Sombrero rosa", "PNG"], "banner": ["Banner del enlace", "PNG, panor\xE1mico"] },
      kit: "Descargar todo (.zip)",
      moreTitle: "M\xE1s versiones (SVG)",
      moreNote: "Archivos SVG para escalar. Solo la corona es vector real; el resto lleva una imagen de alta calidad dentro.",
      moreNames: { "crown": "Corona", "duck-crown": "Pato Premium", "duck-bowl": "Pato en una taza", "duck-bowl-crown": "Pato Premium en una taza", "duck-plain": "Pato sin sombrero", "duck-hat-red": "Sombrero rojo", "duck-hat-pink": "Sombrero rosa", "duck-hat-green": "Sombrero verde", "duck-hat-peach": "Sombrero durazno", "duck-hat-blue": "Sombrero azul", "duck-hat-wine": "Sombrero guinda", "hat-blue": "Solo sombrero, azul", "hat-wine": "Solo sombrero, guinda", "hat-green": "Solo sombrero, verde", "hat-pink": "Solo sombrero, rosa" },
      download: "Descargar",
      colorTitle: "Colores",
      colorText: "Haz clic en un color para copiar su c\xF3digo hex.",
      copied: "Copiado",
      colors: [
        { name: "Durazno", hex: "#f0a88f", use: "Acento principal" },
        { name: "Noche", hex: "#111113", use: "Fondo" },
        { name: "Tarjeta", hex: "#1c1c20", use: "Superficies" },
        { name: "Menta", hex: "#a5ea7a", use: "\xC9xito" },
        { name: "Amarillo", hex: "#fed53c", use: "Avisos, el pico" },
        { name: "Coral", hex: "#fe6465", use: "Errores" }
      ],
      typeTitle: "Tipograf\xEDa",
      typeText: "Fraunces para los t\xEDtulos, Plus Jakarta Sans para todo lo dem\xE1s.",
      titleSample: "Fraunces",
      textSample: "Plus Jakarta Sans",
      aboutTitle: "Sobre Petto",
      shortLabel: "Descripci\xF3n corta",
      short: "Petto es un bot de Discord para moderaci\xF3n, registros, tickets, canales de voz y m\xE1s, con un panel limpio.",
      longLabel: "Descripci\xF3n larga",
      long: "Petto es un bot de Discord todo en uno que ayuda a las comunidades a mantenerse seguras y organizadas. Re\xFAne moderaci\xF3n, registros, tickets, apelaciones, VoiceMaster, niveles y un panel web completo, en ingl\xE9s, espa\xF1ol y portugu\xE9s.",
      copy: "Copiar texto",
      rulesTitle: "Qu\xE9 hacer y qu\xE9 no",
      dos: ["Usa los archivos originales", "Deja espacio libre alrededor del pato", 'Escribe el nombre como "Petto"', "Enlaza a petto.sbs"],
      donts: ["No estires, gires ni recolores el pato", "No agregues efectos ni sombras", "No des a entender que Petto respalda tu proyecto", "No vendas los recursos"],
      contact: "\xBFNecesitas algo m\xE1s, como un tama\xF1o especial o una alianza?",
      support: "Abrir un ticket de soporte"
    },
    "pt-BR": {
      eyebrow: "Marca",
      title: "A marca do Petto.",
      lede: "Tudo o que voc\xEA precisa para falar do Petto: o mascote, as cores, as fontes e algumas regras simples. Uso livre em artigos, v\xEDdeos, listas de bots e posts de comunidade.",
      logoTitle: "Mascote e vers\xF5es",
      groups: [{ title: "Principal", text: "O mascote de todo dia." }, { title: "Premium", text: "A coroa marca o Petto Premium. Use s\xF3 para o Premium." }, { title: "Cores de chap\xE9u", text: "O mesmo pato com outras cores de chap\xE9u para temas e eventos." }, { title: "Banner", text: "Para pr\xE9vias de links e cabe\xE7alhos." }],
      names: { "mascot-icon": ["\xCDcone do mascote", "PNG"], "bot-avatar": ["Avatar do bot", "PNG, como no Discord"], "duck-plain": ["Pato simples", "PNG, sem chap\xE9u"], "duck-crown": ["Pato Premium", "PNG, com coroa"], "crown": ["Coroa", "PNG, sozinha"], "duck-bowl": ["Pato em uma x\xEDcara", "PNG"], "duck-bowl-crown": ["Pato Premium em uma x\xEDcara", "PNG, com coroa"], "duck-blue": ["Chap\xE9u azul", "PNG"], "duck-green": ["Chap\xE9u verde", "PNG"], "duck-red": ["Chap\xE9u rosa", "PNG"], "banner": ["Banner do link", "PNG, panor\xE2mico"] },
      kit: "Baixar tudo (.zip)",
      moreTitle: "Mais vers\xF5es (SVG)",
      moreNote: "Arquivos SVG para escalar. S\xF3 a coroa \xE9 vetor de verdade; o resto leva uma imagem de alta qualidade dentro.",
      moreNames: { "crown": "Coroa", "duck-crown": "Pato Premium", "duck-bowl": "Pato em uma x\xEDcara", "duck-bowl-crown": "Pato Premium em uma x\xEDcara", "duck-plain": "Pato sem chap\xE9u", "duck-hat-red": "Chap\xE9u vermelho", "duck-hat-pink": "Chap\xE9u rosa", "duck-hat-green": "Chap\xE9u verde", "duck-hat-peach": "Chap\xE9u p\xEAssego", "duck-hat-blue": "Chap\xE9u azul", "duck-hat-wine": "Chap\xE9u vinho", "hat-blue": "S\xF3 o chap\xE9u, azul", "hat-wine": "S\xF3 o chap\xE9u, vinho", "hat-green": "S\xF3 o chap\xE9u, verde", "hat-pink": "S\xF3 o chap\xE9u, rosa" },
      download: "Baixar",
      colorTitle: "Cores",
      colorText: "Clique em uma cor para copiar o c\xF3digo hex.",
      copied: "Copiado",
      colors: [
        { name: "P\xEAssego", hex: "#f0a88f", use: "Destaque principal" },
        { name: "Noite", hex: "#111113", use: "Fundo" },
        { name: "Cart\xE3o", hex: "#1c1c20", use: "Superf\xEDcies" },
        { name: "Menta", hex: "#a5ea7a", use: "Sucesso" },
        { name: "Amarelo", hex: "#fed53c", use: "Avisos, o bico" },
        { name: "Coral", hex: "#fe6465", use: "Erros" }
      ],
      typeTitle: "Tipografia",
      typeText: "Fraunces para os t\xEDtulos, Plus Jakarta Sans para o resto.",
      titleSample: "Fraunces",
      textSample: "Plus Jakarta Sans",
      aboutTitle: "Sobre o Petto",
      shortLabel: "Descri\xE7\xE3o curta",
      short: "O Petto \xE9 um bot de Discord para modera\xE7\xE3o, logs, tickets, canais de voz e mais, com um painel limpo.",
      longLabel: "Descri\xE7\xE3o longa",
      long: "O Petto \xE9 um bot de Discord tudo em um que ajuda as comunidades a se manterem seguras e organizadas. Re\xFAne modera\xE7\xE3o, logs, tickets, apela\xE7\xF5es, VoiceMaster, n\xEDveis e um painel web completo, em ingl\xEAs, espanhol e portugu\xEAs.",
      copy: "Copiar texto",
      rulesTitle: "Pode e n\xE3o pode",
      dos: ["Use os arquivos originais", "Deixe espa\xE7o livre ao redor do pato", 'Escreva o nome como "Petto"', "Linke para petto.sbs"],
      donts: ["N\xE3o estique, gire nem recolora o pato", "N\xE3o adicione efeitos ou sombras", "N\xE3o sugira que o Petto apoia seu projeto", "N\xE3o venda os arquivos"],
      contact: "Precisa de algo mais, como um tamanho especial ou uma parceria?",
      support: "Abrir um ticket de suporte"
    }
  };
  const t = copy[lang];
  const characterSlugs = ["pipo", "luna", "chispa", "nube", "bambu", "lili", "miel", "copo", "bellota"];
  const characterCopy = {
    en: {
      title: "The friends of Petto",
      text: "Nine characters that appear on the default image cards of Petto: the welcome, rank and level-up cards. They are original artwork made for Petto in October 2026, drawn from scratch with code. No picture was copied, traced or downloaded from anywhere. The names and the drawings are part of the Petto brand.",
      note: "Pipo is a duckling, not the Petto duck: the mascot is the duck with the hat. The rules below apply to the friends too. Click a friend to download it as a PNG with a transparent background. Need another size or have a question? Open a support ticket.",
      list: {
        pipo: ["Pipo", "A duckling floating on a pond."],
        luna: ["Luna", "A ginger cat in front of the moon."],
        chispa: ["Chispa", "A fox among the fireflies."],
        nube: ["Nube", "A white bunny under a purple night."],
        bambu: ["Bamb\xFA", "A panda in a bamboo grove."],
        lili: ["Lili", "A frog on a lily pad."],
        miel: ["Miel", "A bear with a jar of honey."],
        copo: ["Copo", "A penguin on the polar ice."],
        bellota: ["Bellota", "A hedgehog in an autumn forest."]
      }
    },
    es: {
      title: "Los amigos de Petto",
      text: "Nueve personajes que aparecen en las tarjetas de imagen por defecto de Petto: las de bienvenida, rango y subida de nivel. Son arte original hecho para Petto en octubre de 2026, dibujado desde cero con c\xF3digo. Ninguna imagen fue copiada, calcada ni descargada de ning\xFAn sitio. Los nombres y los dibujos forman parte de la marca Petto.",
      note: "Pipo es un patito, no el pato de Petto: la mascota es el pato con sombrero. Las reglas de abajo tambi\xE9n valen para los amigos. Haz clic en un amigo para descargarlo como PNG con fondo transparente. \xBFNecesitas otro tama\xF1o o tienes una duda? Abre un ticket de soporte.",
      list: {
        pipo: ["Pipo", "Un patito flotando en un estanque."],
        luna: ["Luna", "Una gata naranja frente a la luna."],
        chispa: ["Chispa", "Un zorro entre las luci\xE9rnagas."],
        nube: ["Nube", "Una conejita blanca bajo una noche morada."],
        bambu: ["Bamb\xFA", "Un panda en un bosque de bamb\xFA."],
        lili: ["Lili", "Una rana sobre un nen\xFAfar."],
        miel: ["Miel", "Un oso con un tarro de miel."],
        copo: ["Copo", "Un ping\xFCino sobre el hielo polar."],
        bellota: ["Bellota", "Un erizo en un bosque de oto\xF1o."]
      }
    },
    "pt-BR": {
      title: "Os amigos do Petto",
      text: "Nove personagens que aparecem nos cards de imagem padr\xE3o do Petto: os de boas-vindas, rank e subida de n\xEDvel. S\xE3o arte original feita para o Petto em outubro de 2026, desenhada do zero com c\xF3digo. Nenhuma imagem foi copiada, decalcada nem baixada de lugar nenhum. Os nomes e os desenhos fazem parte da marca Petto.",
      note: "Pipo \xE9 um patinho, n\xE3o o pato do Petto: o mascote \xE9 o pato com chap\xE9u. As regras abaixo valem tamb\xE9m para os amigos. Clique em um amigo para baix\xE1-lo como PNG com fundo transparente. Precisa de outro tamanho ou tem uma d\xFAvida? Abra um ticket de suporte.",
      list: {
        pipo: ["Pipo", "Um patinho flutuando em um lago."],
        luna: ["Luna", "Uma gata laranja na frente da lua."],
        chispa: ["Chispa", "Uma raposa entre os vaga-lumes."],
        nube: ["Nube", "Uma coelhinha branca sob uma noite roxa."],
        bambu: ["Bamb\xFA", "Um panda em um bambuzal."],
        lili: ["Lili", "Uma r\xE3 em uma vit\xF3ria-r\xE9gia."],
        miel: ["Miel", "Um urso com um pote de mel."],
        copo: ["Copo", "Um pinguim no gelo polar."],
        bellota: ["Bellota", "Um ouri\xE7o em uma floresta de outono."]
      }
    }
  };
  const characters = characterCopy[lang];
  const groupFiles = [
    ["mascot-icon", "bot-avatar", "duck-plain"],
    ["duck-crown", "crown", "duck-bowl", "duck-bowl-crown"],
    ["duck-blue", "duck-green", "duck-red"],
    ["petto-link-banner-min"]
  ];
  const svgFiles = ["crown", "duck-crown", "duck-bowl", "duck-bowl-crown", "duck-plain", "duck-hat-red", "duck-hat-pink", "duck-hat-green", "duck-hat-peach", "duck-hat-blue", "duck-hat-wine", "hat-blue", "hat-wine", "hat-green", "hat-pink"];
  const fileKey = (file) => file === "petto-link-banner-min" ? "banner" : file;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${t.eyebrow} \xB7 Petto`, "lang": lang, "data-astro-cid-7eczacpb": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-7eczacpb> <section class="br-hero" data-astro-cid-7eczacpb> <div class="wrap" data-astro-cid-7eczacpb> <div class="eyebrow reveal" data-astro-cid-7eczacpb>${t.eyebrow}</div> <h1 class="reveal" data-astro-cid-7eczacpb>${t.title}</h1> <p class="br-lede reveal" data-astro-cid-7eczacpb>${t.lede}</p> </div> </section> <section class="br-sec" data-astro-cid-7eczacpb> <div class="wrap" data-astro-cid-7eczacpb> <h2 class="br-h" data-astro-cid-7eczacpb>${t.logoTitle}</h2> <a class="btn btn-ghost btn-sm br-kit" href="/assets/brand/petto-brand-kit.zip" download data-astro-cid-7eczacpb> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:download-simple-bold", "width": "14", "height": "14", "data-astro-cid-7eczacpb": true })}${t.kit} </a> ${t.groups.map((group, index) => renderTemplate`<div class="br-group" data-astro-cid-7eczacpb> <h3 class="br-gh" data-astro-cid-7eczacpb>${group.title}</h3> <p class="br-p" data-astro-cid-7eczacpb>${group.text}</p> <div class="br-assets" data-astro-cid-7eczacpb> ${groupFiles[index].map((file) => {
    const [name, note] = t.names[fileKey(file)];
    return renderTemplate`<a class="br-asset"${addAttribute(`/assets/brand/${file}.png`, "href")} download${addAttribute(`${t.download}: ${name}`, "title")} data-astro-cid-7eczacpb> <div class="br-thumb" data-astro-cid-7eczacpb><img${addAttribute(`/assets/brand/${file}.png`, "src")}${addAttribute(name, "alt")} loading="lazy" data-astro-cid-7eczacpb></div> <div class="br-asset-body" data-astro-cid-7eczacpb><strong data-astro-cid-7eczacpb>${name}</strong><span data-astro-cid-7eczacpb>${note}</span></div> </a>`;
  })} </div> </div>`)} <details class="br-more" data-astro-cid-7eczacpb> <summary data-astro-cid-7eczacpb>${t.moreTitle}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "14", "height": "14", "data-astro-cid-7eczacpb": true })}</summary> <p class="br-p" data-astro-cid-7eczacpb>${t.moreNote}</p> <div class="br-assets" data-astro-cid-7eczacpb> ${svgFiles.map((file) => renderTemplate`<a class="br-asset"${addAttribute(`/assets/brand/svg/${file}.svg`, "href")} download${addAttribute(`${t.download}: ${t.moreNames[file]}`, "title")} data-astro-cid-7eczacpb> <div class="br-thumb" data-astro-cid-7eczacpb><img${addAttribute(`/assets/brand/svg/${file}.svg`, "src")}${addAttribute(t.moreNames[file], "alt")} loading="lazy" data-astro-cid-7eczacpb></div> <div class="br-asset-body" data-astro-cid-7eczacpb><strong data-astro-cid-7eczacpb>${t.moreNames[file]}</strong><span data-astro-cid-7eczacpb>SVG</span></div> </a>`)} </div> </details> </div> </section> <section class="br-sec" id="friends" data-astro-cid-7eczacpb> <div class="wrap" data-astro-cid-7eczacpb> <h2 class="br-h" data-astro-cid-7eczacpb>${characters.title}</h2> <p class="br-p" data-astro-cid-7eczacpb>${characters.text}</p> <div class="br-chars" data-astro-cid-7eczacpb> ${characterSlugs.map((slug) => renderTemplate`<a class="br-char"${addAttribute(`/assets/brand/characters/${slug}.png`, "href")} download${addAttribute(`${t.download}: ${characters.list[slug][0]}`, "title")} data-astro-cid-7eczacpb> <div class="br-char-thumb" data-astro-cid-7eczacpb><img${addAttribute(`/assets/brand/characters/${slug}.png`, "src")}${addAttribute(`${characters.list[slug][0]}. ${characters.list[slug][1]}`, "alt")} loading="lazy" data-astro-cid-7eczacpb></div> <div class="br-char-body" data-astro-cid-7eczacpb><strong data-astro-cid-7eczacpb>${characters.list[slug][0]}</strong><span data-astro-cid-7eczacpb>${characters.list[slug][1]}</span></div> </a>`)} </div> <p class="br-p br-char-note" data-astro-cid-7eczacpb>${characters.note}</p> </div> </section> <section class="br-sec" data-astro-cid-7eczacpb> <div class="wrap" data-astro-cid-7eczacpb> <h2 class="br-h" data-astro-cid-7eczacpb>${t.colorTitle}</h2> <p class="br-p" data-astro-cid-7eczacpb>${t.colorText}</p> <div class="br-colors" data-astro-cid-7eczacpb> ${t.colors.map((color) => renderTemplate`<button type="button" class="br-color"${addAttribute(color.hex, "data-copy")}${addAttribute(t.copied, "data-done")} data-astro-cid-7eczacpb> <span class="br-swatch"${addAttribute(`background:${color.hex}`, "style")} data-astro-cid-7eczacpb></span> <span class="br-color-name" data-astro-cid-7eczacpb>${color.name}</span> <span class="br-color-hex" data-astro-cid-7eczacpb>${color.hex}</span> <span class="br-color-use" data-astro-cid-7eczacpb>${color.use}</span> </button>`)} </div> </div> </section> <section class="br-sec" data-astro-cid-7eczacpb> <div class="wrap" data-astro-cid-7eczacpb> <h2 class="br-h" data-astro-cid-7eczacpb>${t.typeTitle}</h2> <p class="br-p" data-astro-cid-7eczacpb>${t.typeText}</p> <div class="br-type" data-astro-cid-7eczacpb> <div class="br-type-card" data-astro-cid-7eczacpb><span class="br-serif" data-astro-cid-7eczacpb>Aa</span><b data-astro-cid-7eczacpb>${t.titleSample}</b></div> <div class="br-type-card" data-astro-cid-7eczacpb><span class="br-sans" data-astro-cid-7eczacpb>Aa</span><b data-astro-cid-7eczacpb>${t.textSample}</b></div> </div> </div> </section> <section class="br-sec" data-astro-cid-7eczacpb> <div class="wrap" data-astro-cid-7eczacpb> <h2 class="br-h" data-astro-cid-7eczacpb>${t.aboutTitle}</h2> <div class="br-texts" data-astro-cid-7eczacpb> <div class="br-text" data-astro-cid-7eczacpb> <small data-astro-cid-7eczacpb>${t.shortLabel}</small> <p data-astro-cid-7eczacpb>${t.short}</p> <button type="button" class="btn btn-ghost btn-sm"${addAttribute(t.short, "data-copy")}${addAttribute(t.copied, "data-done")} data-astro-cid-7eczacpb>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:copy-simple-bold", "width": "14", "height": "14", "data-astro-cid-7eczacpb": true })}${t.copy}</button> </div> <div class="br-text" data-astro-cid-7eczacpb> <small data-astro-cid-7eczacpb>${t.longLabel}</small> <p data-astro-cid-7eczacpb>${t.long}</p> <button type="button" class="btn btn-ghost btn-sm"${addAttribute(t.long, "data-copy")}${addAttribute(t.copied, "data-done")} data-astro-cid-7eczacpb>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:copy-simple-bold", "width": "14", "height": "14", "data-astro-cid-7eczacpb": true })}${t.copy}</button> </div> </div> </div> </section> <section class="br-sec" data-astro-cid-7eczacpb> <div class="wrap" data-astro-cid-7eczacpb> <h2 class="br-h" data-astro-cid-7eczacpb>${t.rulesTitle}</h2> <div class="br-rules" data-astro-cid-7eczacpb> <ul class="br-do" data-astro-cid-7eczacpb>${t.dos.map((item) => renderTemplate`<li data-astro-cid-7eczacpb>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "16", "height": "16", "data-astro-cid-7eczacpb": true })}${item}</li>`)}</ul> <ul class="br-dont" data-astro-cid-7eczacpb>${t.donts.map((item) => renderTemplate`<li data-astro-cid-7eczacpb>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-circle-fill", "width": "16", "height": "16", "data-astro-cid-7eczacpb": true })}${item}</li>`)}</ul> </div> <div class="br-contact" data-astro-cid-7eczacpb> <p data-astro-cid-7eczacpb>${t.contact}</p> <a class="btn btn-ghost btn-sm" href="https://petto.sbs/support" target="_blank" rel="noopener" data-astro-cid-7eczacpb> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:ticket", "width": "14", "height": "14", "data-astro-cid-7eczacpb": true })}${t.support} </a> </div> </div> </section> </main> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/Brand.astro", void 0);

export { $$Brand as $ };
