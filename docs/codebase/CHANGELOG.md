# Changelog

## 2024-08-06
### Changed
- Logging is now based on the BasicLogger with separate provider implementations
### Added
- [OpenTelemetry](../../src/common/logging/otel) with Highlight.io
- [Sentry](../../src/common/logging/sentry)

## 2024-06-13
### Added
- [CORS](../../src/common/http/cors/cors.middleware.ts)
- [OpenAPI](../../src/common/http/openapi)
### Changed
- ConfigDecorator can use dot-notation

## 2024-05-10
### Changed
- Added Error handling and Error abstract
- Added Http Request/Response logging and Exception handling

## 2024-05-10
### Changed
- Added global generic request validator using class-validator
- Upgraded to ES2022
- Added scaffolding
- Added UUID generator

## 2024-04-19
### Changed
- Added [class-validator](../../src/vendors/class-validator/CHANGELOG.md) vendor for general validation and injecting
   validated data objects
- Added [config](./04_Config) module based on class-validator
- Added [logger](./05_Observability.md) module based on class-validator
- Upgraded Node to v20.12.2, Yarn to 4.1.1
- Made Eslint and Prettier more strict
- Expanded notes in Readme.md
- Introduced Core module concept, moved stage/version to core
- Added Http module and HttpHealth endpoint

