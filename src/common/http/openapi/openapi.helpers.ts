import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { getConfig } from '~common/config';
import { CoreConfig } from '~common/core';

// eslint-disable-next-line no-restricted-imports
import { appConstants } from '~modules/app/app.constants';

import { OpenApiConfig } from './openapi.config';

const openApiConfig = getConfig(OpenApiConfig);
const coreConfig = getConfig(CoreConfig);

export function getSwaggerDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(openApiConfig.title)
    .setDescription(openApiConfig.description)
    .setVersion(coreConfig.version ?? '0.0.0')
    .addBearerAuth(
      {
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      appConstants.swagger.accessToken,
    )
    .build();
  return SwaggerModule.createDocument(app, config);
}

export function useSwagger(app: INestApplication) {
  SwaggerModule.setup(openApiConfig.path, app, getSwaggerDocument(app), {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
  });
}
