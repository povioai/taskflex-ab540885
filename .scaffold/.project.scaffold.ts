import { createScaffolding } from '@povio/scaffold';
import { z } from '@povio/scaffold/dist/plugins/zod';

export default createScaffolding({
  name: 'project',

  configSchema: z.object({
    name: z.string().regex(/^[a-z][a-z0-9-]+$/),
    description: z.string().optional(),
  }),

  async init({ config }, { addRequest }) {
    await addRequest({
      match: 'package.json:value',
      description: 'set project name',
      value: { path: 'name', value: config!.name, state: 'equals' },
    });

    await addRequest({
      match: 'dot-config:configure',
      value: {
        stage: '[all]',
        state: 'created',
        value: {
          ['core.service']: config!.name,
        },
      },
    });

    if (config!.description) {
      await addRequest({
        match: 'package.json:value',
        description: 'set project description',
        value: { path: 'description', value: config!.description, state: 'equals' },
      });
    }
  },
});
