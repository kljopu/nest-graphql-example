import { registerEnumType } from '@nestjs/graphql';

export const TermUserType = {
  GUEST: 'GUEST',
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
} as const;
export type TermUserType = typeof TermUserType[keyof typeof TermUserType];

registerEnumType(TermUserType, { name: 'TermUserType' });
