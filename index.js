const { ApolloServer, gql } = require("apollo-server");
const { typeDefs, resolvers } = require("./graphqlData");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});