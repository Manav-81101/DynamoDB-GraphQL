const { ApolloServer, gql } = require("apollo-server-express");
const { fetchAll, allUsers, fetchOneKey, addItem } = require("./dynamodb");

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type User {
    name: String
    phoneNumber: String
    email: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    users: [User]
    usersByEmail(email: String): User
    addUser(name: String!, email: String!, phoneNumber: String!): User
  }
`;

const resolvers = {
  Query: {
    users: fetchAll,
    usersByEmail: async (parent, args) => await fetchOneKey(args.email),
    addUser: async (parent, args) => await addItem(args),
  },
};
module.exports = { typeDefs, resolvers };
