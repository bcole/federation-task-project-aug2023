import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';

export async function buildGateway(port) {
  const gateway = new ApolloGateway({
    debug: true,
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        {
          name: 'TASK',
          url: 'http://localhost:4001/graphql',
        },
        {
          name: 'PROJECT',
          url: 'http://localhost:4002/graphql',
        },
      ],
    }),
  });

  const server = new ApolloServer({ gateway });
  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`Gateway running ${url}`);
}
