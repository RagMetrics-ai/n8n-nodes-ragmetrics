import {
  ICredentialType,
  INodeProperties,
  ICredentialTestRequest,
  IHttpRequestOptions,
  ICredentialDataDecryptedObject,
} from 'n8n-workflow';

export class RagmetricsApi implements ICredentialType {
  name = 'ragmetricsApi';
  displayName = 'Ragmetrics API';
  documentationUrl = 'https://ragmetrics.ai';
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
      description: 'Your Ragmetrics API key',
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      url: 'https://api.ragmetrics.ai/api/client/login/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        key: '={{ $credentials.apiKey }}',
      },
    },
  };

  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    requestOptions.headers = {
      ...requestOptions.headers,
      'Authorization': `Token ${(credentials.apiKey as string).trim()}`,
    };
    return requestOptions;
  }
}
