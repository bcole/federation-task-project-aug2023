import { buildSubgraph as task } from './task.js';
import { buildSubgraph as project } from './project.js';
import { buildGateway } from './gateway.js';

(async () => {
  await Promise.all([task(4001), project(4002)]);
  await new Promise((r) => setTimeout(r, 1000));
  await buildGateway(4000);
})();
