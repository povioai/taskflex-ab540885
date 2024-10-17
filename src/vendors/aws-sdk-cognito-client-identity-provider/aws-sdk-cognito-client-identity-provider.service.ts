import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';

import { LoggerService } from '~common/logging';

import { AwsCognitoClientIdentityProviderConfig } from './aws-sdk-cognito-client-identity-provider.config';
import { IAwsSdkCognitoClientIdentityProviderUser } from './interfaces/aws-sdk-cognito-client-identity-provider.user.interface';

@Injectable()
export class AwsCognitoClientIdentityProviderService {
  constructor(
    readonly awsCognitoClientIdentityProviderConfig: AwsCognitoClientIdentityProviderConfig,
    protected readonly logger: LoggerService,
  ) {
    this._client = new CognitoIdentityProvider({ region: awsCognitoClientIdentityProviderConfig.region });
  }

  private _client: CognitoIdentityProvider;

  async getUser(accessToken: string): Promise<IAwsSdkCognitoClientIdentityProviderUser> {
    const cognitoUser = await this._client.getUser({ AccessToken: accessToken });

    const username = cognitoUser.Username;
    const cognitoUserAttributes = cognitoUser.UserAttributes;
    const attributes = new Map<string, string | undefined>();

    if (cognitoUserAttributes) {
      cognitoUserAttributes.map((attribute) => {
        if (attribute.Name) {
          attributes.set(attribute.Name, attribute.Value);
        }
      });
    }

    return {
      username,
      attributes,
    };
  }
}
