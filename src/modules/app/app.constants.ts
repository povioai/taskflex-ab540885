export const appConstants = {
  swagger: {
    accessToken: 'access-token',
    apiKey: 'X-API-KEY',
    apiKeyAuthName: 'api_key',
  },
  uuid: {
    version: '4' as const,
  },
  pagination: {
    page: {
      min: 1,
      default: 1,
    },
    limit: {
      min: 1,
      max: 100,
      default: 20,
    },
  },
};
