module.exports = {
  proxy: 'http://127.0.0.1:3030/admin',
  port: 3031,
  ui: false,
  WatchEvents: ['change', 'add', 'unlink', 'addDir', 'unlinkDir'],
  server: false,
  open: 'local',
  notify: false,
  reloadDebounce: 500,
  reloadDelay: 3000,
  files: ['dist'],
};
