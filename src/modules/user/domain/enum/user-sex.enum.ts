import { registerEnumType } from '@nestjs/graphql';

export const UserSex = {
  MAN: 'MAN',
  WOMAN: 'WOMAN',
} as const;
export type UserSex = typeof UserSex[keyof typeof UserSex];

registerEnumType(UserSex, { name: 'UserSex' });
