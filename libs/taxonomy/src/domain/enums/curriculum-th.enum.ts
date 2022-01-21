export const CurriculumTh = {
  EIGHT: '8',
  NINE: '9',
} as const;
export type CurriculumTh = typeof CurriculumTh[keyof typeof CurriculumTh];
