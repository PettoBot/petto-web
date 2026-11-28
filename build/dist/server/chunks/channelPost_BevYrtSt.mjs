function postableChannel(channel) {
  const canPost = channel.bot_can_send !== false;
  const problem = canPost ? null : channel.bot_can_view === false ? "view" : channel.bot_can_view === true ? "send" : "unknown";
  return { id: String(channel.id), name: String(channel.name), canPost, problem };
}
function postProblemText(dt, problem) {
  if (!problem) return "";
  if (problem === "view") return dt("Petto cannot see this channel");
  if (problem === "send") return dt("Petto cannot send messages here");
  return dt("Petto needs View Channel and Send Messages here");
}
function withPostNotes(dt, channels) {
  return channels.map((channel) => channel.problem ? { ...channel, note: postProblemText(dt, channel.problem) } : channel);
}

export { postProblemText as a, postableChannel as p, withPostNotes as w };
