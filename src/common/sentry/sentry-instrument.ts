import { init } from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { getConfig } from '~common/config';

import { AppConfig } from '~modules/app/app.config';

import { SentryConfig } from './sentry.config';

const sentryConfig = getConfig(SentryConfig);
const appConfig = getConfig(AppConfig);

// Ensure to call this before requiring any other modules!
init({
  environment: appConfig.stage,

  // Read DNS from process.env
  dsn: sentryConfig.dsn,
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],

  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

console.log('Sentry Instrumentation loaded');
