import { createScaffolding } from '@povio/scaffold';
import { satisfies } from '@povio/scaffold/dist/plugins/semver';

export default createScaffolding({
  name: '~vendors/logger',

  async init({ modules }, { setStatus, addMessage }) {
    if (
      !modules['~vendors/class-validator'] ||
      !satisfies(modules['~vendors/class-validator'].version ?? '1.0.0', '^1.0.0')
    ) {
      addMessage('error', 'Missing or incompatible ~vendors/class-validator module');
      setStatus('errored');
      return;
    }
  },
});
