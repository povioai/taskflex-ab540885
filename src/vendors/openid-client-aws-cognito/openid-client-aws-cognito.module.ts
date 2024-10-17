// @Module({})
// export class OpenidClientAwsCognitoModule {
//   static forRoot(config: IOpenidClientAwsCognitoConfig): DynamicModule {
//     return {
//       module: OpenidClientAwsCognitoModule,
//       providers: [
//         plainToValidatedInstanceProvider(OpenidClientAwsCognitoConfig, config),
//         {
//           provide: OpenidClientAwsCognitoService.LOGGER_KEY,
//           useValue: new Logger(OpenidClientAwsCognitoService.name),
//         },
//         OpenidClientAwsCognitoService,
//       ],
//       exports: [OpenidClientAwsCognitoService],
//     };
//   }
// }
