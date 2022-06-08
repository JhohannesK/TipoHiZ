export {default} from './model';
import typeDefs from './schema';
import Query from './queryResolvers';
import Mutation from './mutationResolvers';

const resolvers = {Query, Mutation};

export const viewerSchema = {typeDefs, resolvers};
