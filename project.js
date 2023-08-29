import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';

export async function buildSubgraph(port) {
  const typeDefs = parse(`
    extend schema
      @link(url: "https://specs.apollo.dev/federation/v2.0",
            import: ["@key", "@shareable"])
            
    type Query {
      project(id: ID!): Project!
    }

    type Project @key(fields: "id") {
      id: ID!
      projectDetail1: String!
    }
  `);

  const resolvers = {
    Query: {
      project: (_, { id }) => ({
        id,
      }),
    },
    Project: {
      projectDetail1: ({ id }) => `Project detail ${id}`,
      __resolveReference: ({ __typename, id }) => {
        console.log(
          `Resolving reference (Project Subgraph): __typename: ${__typename}, id: ${id}`
        );
        return {
          id: id,
        };
      },
    },
  };

  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`Subgraph running ${url}`);
}
