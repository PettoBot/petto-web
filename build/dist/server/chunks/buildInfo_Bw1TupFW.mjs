const buildInfo = {
  version: "0.5.10",
  builtAt: "2026-11-28T06:46:00.632Z",
  commit: "d677948",
  target: "discloud"
};
function buildLabel() {
  return `Web v${buildInfo.version}`;
}
function buildTitle() {
  const when = buildInfo.builtAt.replace("T", " ").slice(0, 16);
  return `Petto web v${buildInfo.version}${buildInfo.commit ? ` · commit ${buildInfo.commit}` : ""} · ${buildInfo.target} · built ${when} UTC`;
}

export { buildTitle as a, buildInfo as b, buildLabel as c };
