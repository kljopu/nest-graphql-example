import { registerEnumType } from '@nestjs/graphql';

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE',
  BLOCK: 'BLOCK',
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

registerEnumType(UserStatus, { name: 'UserStatus' });
