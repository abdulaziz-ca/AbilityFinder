/* =============================================================================
   ICONS — a small, consistent inline-SVG set (stroke-based, currentColor).
   Replaces emoji throughout. icon(name) returns an <svg> string.
   ========================================================================== */
const ICON_PATHS = {
  /* disabilities */
  adhd: '<path d="M13 2 4 14h7l-1 8 10-12h-7l0-8z"/>',
  autism:
    '<circle cx="12" cy="12" r="9"/><path d="M8 15c1-3 2.5-4.5 4-4.5s3 1.5 4 4.5"/><circle cx="9" cy="9.5" r=".6" fill="currentColor" stroke="none"/><circle cx="15" cy="9.5" r=".6" fill="currentColor" stroke="none"/>',
  learning:
    '<path d="M12 7v13"/><path d="M3 5.5C5 4.6 7 4.3 9 4.6c1.2.2 2.2.7 3 1.4.8-.7 1.8-1.2 3-1.4 2-.3 4 0 6 .9V18c-2-.9-4-1.2-6-.9-1.2.2-2.2.7-3 1.4-.8-.7-1.8-1.2-3-1.4-2-.3-4 0-6 .9z"/>',
  intellectual:
    '<path d="M7 20h10"/><path d="M12 20v-7"/><path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 11c0-2.2 2-4 5-4 0 3-2.5 4.5-5 4z"/>',
  mental:
    '<path d="M20 13.5c1.2-1.4 2-2.9 2-4.7A4.3 4.3 0 0 0 12 5.6 4.3 4.3 0 0 0 2 8.8c0 1.8.8 3.3 2 4.7l8 7.5z"/><path d="M9 9.5l1.6 1.6L14 8"/>',
  physical:
    '<circle cx="12" cy="4.2" r="1.8"/><path d="M8 9h8"/><path d="M10 9v4h3.5l2.5 6.5"/><path d="M10 13l-1.8 6.5"/>',
  chronic: '<path d="M2 12h4l2.5 7 4-15 2.5 8H22"/>',
  vision:
    '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  hearing:
    '<path d="M7 8a5 5 0 0 1 10 .2c0 2.3-1.8 3.3-3 4.6-.9 1-1 1.7-1 3a2.4 2.4 0 0 1-4.8.2"/><path d="M6.5 17.5c-.7-.8-1.2-1.6-1.5-2.6"/>',
  speech:
    '<path d="M21 11.5a8.4 8.4 0 0 1-11.7 7.8L3 21l1.7-6.2A8.4 8.4 0 1 1 21 11.5z"/>',
  braininjury:
    '<path d="M12 3a4 4 0 0 0-4 4c-1.7.4-3 1.9-3 3.7 0 1 .4 2 1.1 2.6-.2 1.8.9 3.4 2.6 3.9.3 1.6 1.7 2.8 3.3 2.8"/><path d="M12 3a4 4 0 0 1 4 4c1.7.4 3 1.9 3 3.7 0 1-.4 2-1.1 2.6.2 1.8-.9 3.4-2.6 3.9-.3 1.6-1.7 2.8-3.3 2.8"/><path d="M12 3v17"/>',
  other: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',

  /* situations */
  student:
    '<path d="M22 10 12 5.5 2 10l10 4.5L22 10z"/><path d="M6 11.5V16c0 1.3 2.7 2.8 6 2.8s6-1.5 6-2.8v-4.5"/>',
  working:
    '<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 7V5.5A2 2 0 0 1 10 3.5h4a2 2 0 0 1 2 2V7"/><path d="M2.5 12.5h19"/>',
  looking: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  unable:
    '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5v5M14.5 9.5v5"/>',
  none: '<path d="M5 12h14"/>',

  /* categories */
  money:
    '<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11"/><path d="M15 9c0-1.4-1.3-2.2-3-2.2S9 7.5 9 9.2 10.3 11 12 11s3 .5 3 2.2-1.3 2.3-3 2.3-3-.8-3-2.2"/>',
  health:
    '<path d="M11 3.5h2a1 1 0 0 1 1 1V9h4.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H14v4.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V13H5.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1H10V4.5a1 1 0 0 1 1-1z"/>',
  education:
    '<path d="M22 10 12 5.5 2 10l10 4.5L22 10z"/><path d="M6 11.5V16c0 1.3 2.7 2.8 6 2.8s6-1.5 6-2.8v-4.5"/><path d="M22 10v5"/>',
  transit:
    '<rect x="4" y="4" width="16" height="13" rx="2.5"/><path d="M4 11.5h16"/><path d="M7.5 17v2M16.5 17v2"/><circle cx="8" cy="14.2" r=".7" fill="currentColor" stroke="none"/><circle cx="16" cy="14.2" r=".7" fill="currentColor" stroke="none"/>',
  family:
    '<circle cx="8.5" cy="8" r="3"/><path d="M2.5 20c0-3.1 2.7-5.2 6-5.2"/><circle cx="16" cy="9.5" r="2.4"/><path d="M12.5 20c0-2.8 2-4.6 5-4.6s5 1.8 5 4.6"/>',

  /* intro / status */
  check: '<path d="M20 6 9 17l-5-5"/>',
  link:
    '<path d="M9.5 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14.5 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
  lock:
    '<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
  key:
    '<circle cx="8" cy="8" r="4.2"/><path d="m11 11 8.5 8.5"/><path d="m16.5 16.5 2-2"/><path d="m18.5 18.5 1.8-1.8"/>',

  /* ui */
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  compass:
    '<circle cx="12" cy="12" r="9.2"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2z" fill="currentColor" stroke="none"/>',
  speaker:
    '<path d="M11 5 6.5 9H3v6h3.5L11 19z"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.4 3.9 5.6 4 9-.1 3.4-1.5 6.6-4 9-2.5-2.4-3.9-5.6-4-9 .1-3.4 1.5-6.6 4-9z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  print:
    '<path d="M6.5 9.5V3.5h11v6"/><rect x="6.5" y="13.5" width="11" height="7"/><path d="M6.5 17.5h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  access:
    '<circle cx="12" cy="4" r="1.7"/><path d="M5.5 8.5c2 .9 4.2 1.4 6.5 1.4s4.5-.5 6.5-1.4"/><path d="M12 9.5V14"/><path d="M12 14c1.6 0 3 1 3.6 2.5l1.4 3.5"/><path d="M12 14c-1.6 0-3 1-3.6 2.5L7 20"/>',
  textSize: '<path d="M4 7V5h9v2"/><path d="M8.5 5v13"/><path d="M6 18h5"/><path d="M14 12v-1.3h6V12"/><path d="M17 10.7V18"/><path d="M15.5 18h3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".7" fill="currentColor" stroke="none"/>',
  bookmark: '<path d="M6 4.5h12v16l-6-4.2-6 4.2z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
  phone:
    '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z"/>',
  help:
    '<path d="M12 21C7 17.5 3.5 14 3.5 9.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.5 2.8C20.5 14 17 17.5 12 21z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.2"/>',
  list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none"/>',
  scale:
    '<path d="M12 4v16"/><path d="M7 20h10"/><path d="M12 6 5 8l-2.2 4.5a3 3 0 0 0 4.4 0L5 8"/><path d="M12 6l7 2 2.2 4.5a3 3 0 0 1-4.4 0L19 8"/>',
};

function icon(name, cls) {
  const p = ICON_PATHS[name];
  if (!p) return "";
  return `<svg class="ic ${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}
