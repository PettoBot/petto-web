/** Which build is running: the version in package.json, when it was built, from which commit, and for which host. */
export const buildInfo = {
  version: __APP_VERSION__,
  builtAt: __BUILD_TIME__,
  commit: __BUILD_COMMIT__ || null,
  target: __BUILD_TARGET__,
};

/** `Web v0.3.0`: what the footer and the dashboard menu show (the website has its own version, apart from the bot's). The commit stays in the tooltip and in /version.json. */
export function buildLabel(): string {
  return `Web v${buildInfo.version}`;
}

/** The longer text for a tooltip: version, commit, host and the time of the build in UTC. */
export function buildTitle(): string {
  const when = buildInfo.builtAt.replace('T', ' ').slice(0, 16);
  return `Petto web v${buildInfo.version}${buildInfo.commit ? ` · commit ${buildInfo.commit}` : ''} · ${buildInfo.target} · built ${when} UTC`;
}
