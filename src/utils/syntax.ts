export type SyntaxToken = { type: 'req' | 'opt' | 'plain'; text: string };

export function renderSyntax(syntax: string): SyntaxToken[] {
  return syntax
    .split(/(<[^>]+>|\[[^\]]+\])/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith('<')) return { type: 'req' as const, text: part };
      if (part.startsWith('[')) return { type: 'opt' as const, text: part };
      return { type: 'plain' as const, text: part };
    });
}
