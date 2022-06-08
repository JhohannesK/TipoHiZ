import {gql} from 'apollo-server-express';

export default gql`
  type Viewer {
    id: String
    username: String
    email: String
    role: String
  }

  extend type Query {
    me: Viewer
    viewers: [Viewer]
    viewer(login: String!): Viewer
  }

  type Auth {
    token: String
    viewer: Viewer
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): Auth
    login(login: String!, password: String!): Auth
  }
`;
