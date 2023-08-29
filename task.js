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
      task(id: ID!): Task!
    }
    
    type Task @key( fields: "id") {
      id: ID!
      name: String!
      project: Project!
    }
    
    type Project @key(fields: "id") {
      id: ID!
      tasks: [Task!]!
    }
  `);

  const resolvers = {
    Query: {
      task: (_, { id }) => ({
        id,
        name: `task ${id}`,
        project: { id: '1212' },
      }),
    },
    Project: {
      __resolveReference: ({ __typename, id }) => {
        console.log(
          `Resolving reference (Task Subgraph): __typename: ${__typename}, id: ${id}`
        );
        return {
          id: id,
          tasks: [{ id: 1 }, { id: 2 }],
        };
      },
    },
  };

  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`Subgraph running ${url}`);
}
