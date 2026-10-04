/** Which build is running: the version in package.json, when it was built, from which commit, and for which host. */
export const buildInfo = {
  version: __APP_VERSION__,
  builtAt: __BUILD_TIME__,
  commit: __BUILD_COMMIT__ || null,
  target: __BUILD_TARGET__,
};

/** `v0.2.179 · c4526e9`, short enough for a footer. */
export function buildLabel(): string {
  return `v${buildInfo.version}${buildInfo.commit ? ` · ${buildInfo.commit}` : ''}`;
}

/** The longer text for a tooltip: version, commit, host and the time of the build in UTC. */
export function buildTitle(): string {
  const when = buildInfo.builtAt.replace('T', ' ').slice(0, 16);
  return `Petto web v${buildInfo.version}${buildInfo.commit ? ` · commit ${buildInfo.commit}` : ''} · ${buildInfo.target} · built ${when} UTC`;
}
