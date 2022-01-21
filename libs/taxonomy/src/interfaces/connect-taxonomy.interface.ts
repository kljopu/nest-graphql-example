import { FlexType } from '@taxonomy/domain/enums/flex-type.enum';
import { NodeType } from '@taxonomy/domain/enums/node-type.enum';

export interface ConnectTaxonomy {
  startTaxonomyId: number;
  endTaxonomyIds: number[];
  flex_type: FlexType;
  node_type: NodeType;
}
