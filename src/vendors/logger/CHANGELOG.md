# Changelog

## 2024-05-12
### Removed
- Removed `BaseContextLoggerService` as it was too specific, and moved to `BasicLoggerService`.

## 2024-04-19
### Added
- Added `BaseLoggerService` as a base class for all logger services to be used within /vendors and extended
   for specific logger transports. The purpose was to generalise all logs to the BaseLogInstance.
- Added `BaseContextLoggerService` as an optional layer to allow setting per injector log levels.

