import { registerEnumType } from '@nestjs/graphql';

export const TutoringState = {
  MATCHED: 'MATCHED',
  REMATCH_B: 'REMATCH_B',
  REMATCH: 'REMATCH',
  NOPAY: 'NOPAY',
  NOCARD: 'NOCARD',
  ACTIVE: 'ACTIVE',
  REGISTER: 'REGISTER',
  FINISH: 'FINISH',
  AUTO_FINISH: 'AUTO_FINISH',
  DONE: 'DONE',
} as const;
export type TutoringState = typeof TutoringState[keyof typeof TutoringState];

registerEnumType(TutoringState, { name: 'TutoringState' });
