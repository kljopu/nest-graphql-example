export const TaxonomyType = {
  SCHOOL_GRADES: 'school_grades',
  YEAR: 'year',
} as const;
export type TaxonomyType = typeof TaxonomyType[keyof typeof TaxonomyType];
