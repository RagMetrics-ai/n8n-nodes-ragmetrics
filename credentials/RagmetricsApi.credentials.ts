import {
  ICredentialType,
  INodeProperties,
  ICredentialTestRequest,
  IHttpRequestOptions,
  ICredentialDataDecryptedObject,
} from 'n8n-workflow';

export class RagmetricsApi implements ICredentialType {
  name = 'ragmetricsApi';
  displayName = 'RagMetrics API';
  documentationUrl = 'https://ragmetrics.ai';
  // Cast to `any` because n8n's `Icon` type is a union that may vary by version.
  icon = 'file:logo_bw.svg' as any;
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
      description: 'Your RagMetrics API key',
    },
  ];

  // Credential test uses a lightweight authenticated endpoint.
  // Equivalent curl:
  // curl -X GET -H "Authorization: Token <API_KEY>" "https://api.ragmetrics.ai/v2/user/profile/"
  test: ICredentialTestRequest = {
    request: {
      url: 'https://api.ragmetrics.ai/v2/user/profile/',
      method: 'GET',
    },
  };

  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    // Uses header auth for credential test and regular API endpoints.
    const apiKey = (credentials.apiKey as string).trim();
    requestOptions.headers = Object.assign({}, requestOptions.headers, {
      Authorization: `Token ${apiKey}`,
    });
    return requestOptions;
  }
}
