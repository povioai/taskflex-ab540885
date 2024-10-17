export default {
  name: '~vendors/short-uuid',
  requests: [{ match: 'package.json:dependency', value: { pkg: 'short-uuid@^5.2.0' } }],
};
