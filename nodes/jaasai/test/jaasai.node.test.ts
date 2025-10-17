import { Jaasai } from '../Jaasai.node';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Jaasai Node', () => {
  it('should process API response with mock API key', async () => {
    const node = new Jaasai();

    const mockRequest = jest.fn().mockImplementation((options: any) => {
      expect(options.body).toEqual({
        question: "What is the capital of France?",
        answer: "The capital of France is Paris.",
        ground_truth_answer: "The capital of France is Paris.",
        context: "The capital of France is Paris.",
        cohort: "test_cohort",
        evaluation_criteria: ["Accuracy"],
        type: "S",
      });
      return Promise.resolve({
        status: "completed",
        criteria: {
          Accuracy: {},
        },
      });
    });

    const context = {
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'jaas_mock_api_key' }),
      helpers: {
        httpRequestWithAuthentication: mockRequest,
      },
      getInputData: jest.fn().mockReturnValue([
        {
          json: {
            question: "What is the capital of France?",
            answer: "The capital of France is Paris.",
            ground_truth_answer: "The capital of France is Paris.",
            context: "The capital of France is Paris.",
            cohort: "test_cohort",
          },
        },
      ]),
      getNodeParameter: jest.fn().mockImplementation((param: any, index: number) => {
        if (param === 'criteria1') return "Accuracy";
        if (param === 'criteria2') return "";
        if (param === 'criteria3') return "";
        if (param === 'criteria4') return "";
        if (param === 'criteria5') return "";
        if (param === 'type') return "S";
        if (param === 'question') return "What is the capital of France?";
        if (param === 'answer') return "The capital of France is Paris.";
        if (param === 'ground_truth_answer') return "The capital of France is Paris.";
        if (param === 'context') return "The capital of France is Paris.";
        if (param === 'cohort') return "test_cohort";
        return '';
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

    expect(result[0][0].json.status).toBe('completed');
    expect(result[0][0].json.criteria).toHaveProperty('Accuracy');
  });
});
