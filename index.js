require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { typeDefs, resolvers } = require("./graphqlData");

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  app.use(cors("*"));
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: "/graphql",
    }
  );
  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
