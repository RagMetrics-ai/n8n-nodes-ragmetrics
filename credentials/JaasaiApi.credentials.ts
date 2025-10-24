import {
  ICredentialType,
  INodeProperties,
  ICredentialTestRequest,
  IHttpRequestOptions,
  ICredentialDataDecryptedObject,
} from 'n8n-workflow';

export class JaasaiApi implements ICredentialType {
  name = 'jaasaiApi';
  displayName = 'JaaS AI API';
  documentationUrl = 'https://jaas-ai.net';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
			typeOptions: {
    		password: true,
  		},
      default: '',
      required: true,
      description: 'Your JaaS AI API key',
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      url: 'https://api.jaas-ai.com/health',
      method: 'GET',
    },
  };

  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    requestOptions.headers = {
      ...requestOptions.headers,
      'Authorization': `Bearer ${credentials.apiKey}`,
    };
    return requestOptions;
  }
}
