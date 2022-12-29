export const DEFAULT_GAME_OPTIONS = {
  "pass-turn": false,
  "pass-partial": false,
  "shared-pieces": false,
  "deferred-captures": false,
  "maximal-captures": false,
  "smart-moves": false
} satisfies Record<string, boolean>;
