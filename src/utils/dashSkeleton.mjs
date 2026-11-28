// The placeholders shown while a dashboard page loads: one list of shapes for the server pages (DashGuildLayout) and the pages outside a
// server (DashPanelKit), so every page waits with the same look. The look itself (.sk, the shimmer, the sizes) is in Base.astro and uses the
// theme tokens, so it works in the dark and light themes; reduced motion stops the shimmer there.
//
// A link says which shape fits the page it opens with data-sk (see SKELETON_KINDS); "form" is the default of a server page, "list" of the others.
export const SKELETON_KINDS = ['stats', 'grid', 'cards', 'list', 'editor', 'form'];

const repeat = (count, html) => html.repeat(count);
const panel = (fields) => `<div class="sk-panel"><span class="sk sk-head"></span><div class="sk-fields">${fields}</div></div>`;

// The line under the title (every page has one), shared by all the shapes.
export const SKELETON_SUBTITLE = '<span class="sk sk-line short"></span>';

export function skeletonShape(kind) {
  switch (kind) {
    case 'stats':
      return `<span class="sk sk-tabs"></span><div class="sk-row sk-row-6">${repeat(6, '<span class="sk"></span>')}</div><div class="sk-charts-2"><span class="sk sk-block"></span><span class="sk sk-block"></span></div><span class="sk sk-block"></span>`;
    case 'grid':
      return `<div class="sk-toolbar"><span class="sk"></span></div><div class="sk-mods">${repeat(12, '<span class="sk"></span>')}</div>`;
    case 'cards':
      return `<div class="sk-toolbar"><span class="sk"></span><span class="sk btn-ish"></span></div><div class="sk-grid">${repeat(8, '<span class="sk sk-card"></span>')}</div>`;
    case 'list':
      return `<div class="sk-toolbar"><span class="sk"></span><span class="sk btn-ish"></span></div><div class="sk-rows">${repeat(9, '<span class="sk"></span>')}</div>`;
    case 'editor':
      return '<div class="sk-editor"><div class="sk-col"><span class="sk sk-field"></span><span class="sk sk-field"></span><span class="sk sk-field tall"></span><span class="sk sk-field"></span></div><div class="sk-col"><span class="sk sk-card tall"></span></div></div>';
    default:
      return panel('<span class="sk"></span><span class="sk"></span><span class="sk wide"></span>') + panel('<span class="sk"></span><span class="sk"></span><span class="sk wide"></span>');
  }
}
