export interface VarDef { tok: string; desc: string }
export interface VarGroup { label: string; vars: VarDef[] }

// The built-in list of the Embed Builder when the dashboard does not hand it the bot's own: a copy of the bot's registry (English), written by
// scripts/sync-variables.mjs, so it has the variables of every section.
import variables from '../../data/variables.generated.json';

export const VARIABLE_GROUPS: VarGroup[] = (variables as unknown as { en: { label: string; vars: VarDef[] }[] }).en.map((group) => ({ label: group.label, vars: group.vars }));
