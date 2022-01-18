const { gql } = require("apollo-server-express");
const { fetchAll, allUsers, fetchOneKey, addItem } = require("./dynamodb");
const { PubSub, withFilter } = require("graphql-subscriptions");

const pubsub = new PubSub();

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
    fetchAll(tableName: String!): [User]
    fetchByKey(tableName: String!, key: String!, value: String!): User
  }
  type Mutation {
    addUser(name: String!, email: String!, phoneNumber: String!): User
  }
  type Subscription {
    userAdded: User!
  }
`;

const resolvers = {
  Query: {
    fetchAll: async (parent, args) => await fetchAll(args.tableName),
    fetchByKey: async (parent, args) =>
      await fetchOneKey(args.tableName, args.key, args.value),
  },
  Mutation: {
    addUser: async (parent, args) => {
      user = await addItem(args);
      pubsub.publish("userAdded", { userAdded: user });
      return user;
    },
  },
  Subscription: {
    userAdded: { subscribe: () => pubsub.asyncIterator("userAdded") },
  },
};
module.exports = { typeDefs, resolvers };
