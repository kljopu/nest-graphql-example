export const NodeType = {
  SUBJECT_CONCEPT: 'SUBJECT_CONCEPT',
  SUBJECT_YEAR: 'SUBJECT_YEAR',
  HIERARCHY_CHILD: 'HIERARCHY_CHILD',
  HIERARCHY_CHILD_TEMP: 'HIERARCHY_CHILD_TEMP',
  INGANG_LINK: 'INGANG_LINK',
} as const;
export type NodeType = typeof NodeType[keyof typeof NodeType];
