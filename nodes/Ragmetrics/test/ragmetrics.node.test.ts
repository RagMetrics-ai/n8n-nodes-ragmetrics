import { Ragmetrics } from '../Ragmetrics.node';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Ragmetrics Node', () => {
  it('should process API response with mock API key', async () => {
    const node = new Ragmetrics();

    const mockRequest = jest.fn().mockImplementation((options: any) => {
      expect(options.body).toEqual({
        question: 'What is the capital of France?',
        ground_truth: 'The capital of France is Paris.',
        answer: 'The capital of France is Paris.',
        context: 'The capital of France is Paris.',
        eval_group_id: 'test-group',
        criteria: ['Hallucinations', 'Accuracy'],
        type: 'S',
        provider: 'openai',
        model: 'gpt-4o',
      });
      return Promise.resolve({
        message: 'Evaluation complete',
        task_id: 'task-123',
        run_id: 42,
        single_record_id: 7,
        status: 'completed',
      });
    });

    const context = {
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'ragmetrics_mock_api_key' }),
      helpers: {
        httpRequestWithAuthentication: mockRequest,
      },
      getInputData: jest.fn().mockReturnValue([
        {
          json: {},
        },
      ]),
      getNodeParameter: jest.fn().mockImplementation((param: any, index: number) => {
        if (param === 'resource') return 'evaluate';
        if (param === 'operation') return 'evaluate';
        if (param === 'question') return 'What is the capital of France?';
        if (param === 'ground_truth') return 'The capital of France is Paris.';
        if (param === 'answer') return 'The capital of France is Paris.';
        if (param === 'eval_group_id') return 'test-group';
        if (param === 'type') return 'S';
        if (param === 'context') return 'The capital of France is Paris.';
        if (param === 'conversation_id') return 'test-conversation';
        throw new Error(`Unexpected parameter ${param} requested at index ${index}`);
      }),
      getNode: jest.fn(),
      logger: console,
      getCredentialsProperties: jest.fn(),
      getExecutionId: jest.fn(),
      getWorkflow: jest.fn(),
      getWorkflowData: jest.fn(),
      getWorkflowStaticData: jest.fn(),
      getTimezone: jest.fn(),
      getWorkflowParameter: jest.fn(),
      getWorkflowSettings: jest.fn(),
      getCurrentNode: jest.fn(),
      getRunData: jest.fn(),
      getWorkflowId: jest.fn(),
      getWorkflowName: jest.fn(),
      getWorkflowOwner: jest.fn(),
      getRestApiUrl: jest.fn(),
      getInstanceBaseUrl: jest.fn(),
      getInstanceId: jest.fn(),
      getChildNodes: jest.fn(),
      getParentNodes: jest.fn(),
      getNodeType: jest.fn(),
      getWorkflowVersionId: jest.fn(),
      getKnownNodeTypes: jest.fn(),
      prepareOutputData: jest.fn((data: any) => data),
      getMode: jest.fn().mockReturnValue('manual'),
      continueOnFail: jest.fn().mockReturnValue(false),
    } as unknown as IExecuteFunctions;

    const result = await node.execute.call(context);

    expect(result[0][0].json).toEqual({
      message: 'Evaluation complete',
      task_id: 'task-123',
      run_id: 42,
      single_record_id: 7,
      status: 'completed',
    });
  });
});

