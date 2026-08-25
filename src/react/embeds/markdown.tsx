import React from 'react';

let key = 0;
const nextKey = () => `k${key++}`;

function renderInline(text: string): React.ReactNode[] {
  const rules: { re: RegExp; render: (m: RegExpMatchArray) => React.ReactNode }[] = [
    { re: /\{[a-zA-Z0-9_.:|-]+\}/, render: (m) => <span key={nextKey()} className="ebr-md-var">{m[0]}</span> },
    {
      re: /<(a?):(\w+):(\d+)>/,
      render: (m) => (
        <img
          key={nextKey()}
          src={`https://cdn.discordapp.com/emojis/${m[3]}.${m[1] ? 'gif' : 'png'}?size=32`}
          alt={`:${m[2]}:`}
          className="ebr-md-emoji"
        />
      ),
    },
    { re: /\*\*(.+?)\*\*/, render: (m) => <strong key={nextKey()}>{renderInline(m[1])}</strong> },
    { re: /__(.+?)__/, render: (m) => <u key={nextKey()}>{renderInline(m[1])}</u> },
    { re: /~~(.+?)~~/, render: (m) => <s key={nextKey()}>{renderInline(m[1])}</s> },
    { re: /\*(.+?)\*/, render: (m) => <em key={nextKey()}>{renderInline(m[1])}</em> },
    { re: /\|\|(.+?)\|\|/, render: (m) => <span key={nextKey()} className="ebr-md-spoiler">{renderInline(m[1])}</span> },
    { re: /`([^`]+)`/, render: (m) => <code key={nextKey()} className="ebr-md-code">{m[1]}</code> },
  ];

  for (const rule of rules) {
    const m = text.match(rule.re);
    if (m && m.index !== undefined) {
      const before = text.slice(0, m.index);
      const after = text.slice(m.index + m[0].length);
      return [...(before ? renderInline(before) : []), rule.render(m), ...(after ? renderInline(after) : [])];
    }
  }
  return text ? [text] : [];
}

export function renderDiscordMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const parts: React.ReactNode[] = [];
  const codeBlockRe = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = codeBlockRe.exec(text))) {
    if (m.index > lastIndex) parts.push(...renderNonCode(text.slice(lastIndex, m.index)));
    parts.push(<pre key={nextKey()} className="ebr-md-codeblock">{m[1].replace(/^\w*\n/, '')}</pre>);
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(...renderNonCode(text.slice(lastIndex)));
  return parts;
}

function renderNonCode(text: string): React.ReactNode[] {
  return text.split('\n').map((line, i, arr) => {
    const node = renderLine(line);
    return (
      <React.Fragment key={nextKey()}>
        {node}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

function renderLine(line: string): React.ReactNode {
  const heading = line.match(/^(#{1,3})\s+(.*)$/);
  if (heading) {
    const level = heading[1].length;
    const cls = `ebr-md-h${level}`;
    return <span className={cls}>{renderInline(heading[2])}</span>;
  }
  const quote = line.match(/^>\s?(.*)$/);
  if (quote) {
    return <span className="ebr-md-quote">{renderInline(quote[1])}</span>;
  }
  return <>{renderInline(line)}</>;
}
