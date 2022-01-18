import { registerEnumType } from '@nestjs/graphql';

export const LoginPlatform = {
  IOS: 'IOS',
  ANDROID: 'ANDROID',
  WEB: 'WEB',
} as const;
export type LoginPlatform = typeof LoginPlatform[keyof typeof LoginPlatform];

registerEnumType(LoginPlatform, { name: 'LoginPlatform' });
