export const FlexType = {
  SIMPLEX: 'SIMPLEX',
  DUPLEX: 'DUPLEX',
} as const;
export type FlexType = typeof FlexType[keyof typeof FlexType];
