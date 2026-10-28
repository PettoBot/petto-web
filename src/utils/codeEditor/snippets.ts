// Small pieces of Petto Code the editor can insert where the caret is: an embed, a button and what it does, a menu, a
// form, a reaction, a cooldown, a counter, a ranking and mentions. The words people read are in the dashboard language.
import type { CatalogLang } from './catalog';

type Words = Record<CatalogLang, string>;
export interface Snippet { id: string; code: string }

const W = (lang: CatalogLang, words: Words) => words[lang] ?? words.en;

export function snippets(lang: CatalogLang): Snippet[] {
  const w = (en: string, es: string, pt: string) => W(lang, { en, es, pt });
  return [
    {
      id: 'embed',
      code: `{{ $embed := cembed
  "title" (print "${w('Hello', 'Hola', 'Olá')}, " .User.Username "!")
  "description" (print "${w('Welcome to', 'Bienvenido a', 'Bem-vindo a')} **" .Guild.Name "**.")
  "color" "#ff91c2"
  "thumbnail" .User.Avatar
  "footer" .Guild.Name
  "timestamp" true }}
{{ sendMessage nil $embed }}
`,
    },
    {
      id: 'button',
      code: `{{ if eq .Trigger "command" }}
  {{ $button := cbutton "label" "${w('Press me', 'Púlsame', 'Aperte')}" "emoji" "👋" "id" "hi" "style" "primary" }}
  {{ sendMessage nil (complexMessage "content" "${w('Press the button', 'Pulsa el botón', 'Aperte o botão')}" "components" (cslice (crow $button))) }}
{{ return }}{{ end }}

{{ if eq .Trigger "button" }}
  {{ if eq .Button.ID "hi" }}
    {{ respond (print "${w('Hello', 'Hola', 'Olá')}, " .User.Mention "!") true }}
  {{ end }}
{{ return }}{{ end }}
`,
    },
    {
      id: 'menu',
      code: `{{ if eq .Trigger "command" }}
  {{ $menu := cselect "id" "pick" "placeholder" "${w('Choose one', 'Elige uno', 'Escolha um')}" "options" (cslice
    (cslice "${w('Cats', 'Gatos', 'Gatos')}" "cats" "${w('Meow', 'Miau', 'Miau')}")
    (cslice "${w('Dogs', 'Perros', 'Cachorros')}" "dogs" "${w('Woof', 'Guau', 'Au au')}")) }}
  {{ sendMessage nil (complexMessage "content" "${w('What do you like more?', '¿Qué te gusta más?', 'Do que você gosta mais?')}" "components" (cslice (crow $menu))) }}
{{ return }}{{ end }}

{{ if eq .Trigger "select" }}
  {{ $picked := index .Values 0 }}
  {{ respond (print "${w('You chose', 'Elegiste', 'Você escolheu')} " $picked) true }}
{{ return }}{{ end }}
`,
    },
    {
      id: 'modal',
      code: `{{ if eq .Trigger "command" }}
  {{ sendMessage nil (complexMessage "content" "${w('Have an idea?', '¿Tienes una idea?', 'Tem uma ideia?')}" "components" (cslice (crow (cbutton "label" "${w('Suggest', 'Sugerir', 'Sugerir')}" "emoji" "💡" "id" "open" "style" "success")))) }}
{{ return }}{{ end }}

{{ if eq .Trigger "button" }}
  {{ showModal (cmodal "id" "idea" "title" "${w('Your idea', 'Tu idea', 'Sua ideia')}" "fields" (cslice
    (ctext "id" "title" "label" "${w('Title', 'Título', 'Título')}" "max" 80)
    (ctext "id" "details" "label" "${w('Details', 'Detalles', 'Detalhes')}" "style" "paragraph" "required" false))) }}
{{ return }}{{ end }}

{{ if eq .Trigger "modal" }}
  {{ sendMessage nil (cembed "title" (index .Fields "title") "description" (or (index .Fields "details") "-") "color" "#fed53c") }}
  {{ respond "${w('Thanks! It was posted.', '¡Gracias! Se ha publicado.', 'Obrigado! Foi publicada.')}" true }}
{{ return }}{{ end }}
`,
    },
    {
      id: 'modalAll',
      code: `{{ if eq .Trigger "command" }}
  {{ sendMessage nil (complexMessage "content" "${w('Tell us about you', 'Cuéntanos de ti', 'Conte sobre você')}" "components" (cslice (crow (cbutton "label" "${w('Open the form', 'Abrir el formulario', 'Abrir o formulário')}" "id" "open" "style" "primary")))) }}
{{ return }}{{ end }}

{{ if eq .Trigger "button" }}
  {{ showModal (cmodal "id" "about" "title" "${w('About you', 'Sobre ti', 'Sobre você')}" "fields" (cslice
    (cdisplay "${w('Answer what you want, it only takes a minute.', 'Responde lo que quieras, solo tarda un minuto.', 'Responda o que quiser, leva só um minuto.')}")
    (ctext "id" "name" "label" "${w('Name', 'Nombre', 'Nome')}" "description" "${w('How we call you', 'Cómo te llamamos', 'Como chamamos você')}")
    (cmenu "id" "color" "label" "${w('Favorite color', 'Color favorito', 'Cor favorita')}" "options" (cslice (cslice "Pink" "pink") (cslice "Blue" "blue") (cslice "Green" "green")))
    (cusers "id" "friends" "label" "${w('Friends', 'Amigos', 'Amigos')}" "max" 3 "required" false)
    (ccheck "id" "agree" "label" "${w('I accept the rules', 'Acepto las reglas', 'Aceito as regras')}"))) }}
{{ return }}{{ end }}

{{ if eq .Trigger "modal" }}
  {{ sendMessage nil (cembed "title" (index .FieldText "name") "description" (print "${w('Color', 'Color', 'Cor')}: " (index .FieldText "color") "\\n${w('Friends', 'Amigos', 'Amigos')}: " (or (index .FieldText "friends") "-")) "color" "#ff91c2") }}
  {{ respond "${w('Thanks!', '¡Gracias!', 'Obrigado!')}" true }}
{{ return }}{{ end }}
`,
    },
    {
      id: 'reaction',
      code: `{{ if eq .Trigger "command" }}
  {{ sendMessage nil (complexMessage "content" "${w('React with 🎀 to get an answer', 'Reacciona con 🎀 para recibir una respuesta', 'Reaja com 🎀 para receber uma resposta')}" "reactions" (cslice "🎀")) }}
{{ return }}{{ end }}

{{ if eq .Trigger "reaction" }}
  {{ if eq .Reaction.Emoji "🎀" }}
    {{ respond "${w('Thanks for reacting!', '¡Gracias por reaccionar!', 'Obrigado por reagir!')}" true }}
    {{ removeReaction }}
  {{ end }}
{{ return }}{{ end }}
`,
    },
    {
      id: 'cooldown',
      code: `{{ $wait := dbGet "cd:command" .User.ID }}
{{ if $wait }}${w('Wait', 'Espera', 'Espere')} {{ humanizeDuration (sub $wait (unix)) }} ${w('to use it again.', 'para usarlo otra vez.', 'para usar de novo.')}{{ return }}{{ end }}
{{ dbSetExpire "cd:command" (add (unix) 60) 60 .User.ID }}
`,
    },
    {
      id: 'counter',
      code: `{{ $count := dbIncr "uses" 1 .User.ID }}
${w('You used it', 'Lo has usado', 'Você usou')} **{{ $count }}** ${w('times.', 'veces.', 'vezes.')}
`,
    },
    {
      id: 'ranking',
      code: `{{ $points := dbIncr "points" 1 .User.ID }}
{{ $lines := "" }}
{{ range $i, $entry := dbTop "points" 10 }}
  {{ $lines = print $lines (add $i 1) ". " (mentionUser $entry.UserID) " · **" $entry.Value "**\\n" }}
{{ end }}
{{ sendMessage nil (cembed "title" "${w('Ranking', 'Ranking', 'Ranking')}" "description" (or $lines "-") "footer" (print "${w('Your place', 'Tu puesto', 'Sua posição')}: " (or (dbRank "points" .User.ID) "-"))) }}
`,
    },
    {
      id: 'mentions',
      code: `{{ $target := .User }}
{{ with .Mentions }}{{ $target = index . 0 }}{{ end }}
{{ $target.Mention }} ${w('has an account since', 'tiene cuenta desde', 'tem conta desde')} {{ timestamp $target.CreatedAt "D" }}.
`,
    },
  ];
}
