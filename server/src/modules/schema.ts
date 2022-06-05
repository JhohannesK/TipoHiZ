import {buildSubgraphSchema} from '@apollo/subgraph';
import {viewerSchema} from './viewer';

export default buildSubgraphSchema([viewerSchema]);
