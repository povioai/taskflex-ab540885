import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
// import { ITestNestSetupProviderOverride } from '../interfaces/nest-setup.test.provider-override.interface';

import { AppModule } from '~app.module';
import { requestPipes } from '~app.pipes';

import { ITestNestSetupProviderOverride } from '../interfaces/nest-setup.test.provider-override.interface';

export async function createTestingApp(overrides?: ITestNestSetupProviderOverride[]): Promise<INestApplication> {
  const testingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (overrides) {
    overrides.forEach((param) => {
      testingModuleBuilder.overrideProvider(param.typeOrToken).useValue(param.value);
    });
  }

  const compiledTestingModule: TestingModule = await testingModuleBuilder.compile();
  const app = compiledTestingModule.createNestApplication();

  requestPipes(app);

  const result = await app.init();

  return result;
}
