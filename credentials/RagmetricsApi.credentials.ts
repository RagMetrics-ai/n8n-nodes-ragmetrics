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

  // Test request must match: curl -X POST "https://api.ragmetrics.ai/api/client/login/" -H "Content-Type: application/json" -d '{"key": "API KEY"}'
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
    // Uses header auth: Authorization Token (API key is sent in header, not body)
    const apiKey = (credentials.apiKey as string).trim();
    requestOptions.headers = Object.assign({}, requestOptions.headers, {
      Authorization: `Token ${apiKey}`,
    });
    return requestOptions;
  }
}
