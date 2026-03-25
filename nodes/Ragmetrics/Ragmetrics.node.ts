import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionTypes,
  NodeApiError,
} from 'n8n-workflow';

export class Ragmetrics implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'RagMetrics',
    name: 'ragmetrics',
    icon: 'file:logo_bw.svg',
    group: ['transform'],
    version: 1,
    description: 'RagMetrics: Evaluate AI agents and outputs',
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    defaults: {
      name: 'RagMetrics',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'ragmetricsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Evaluation',
            value: 'evaluation',
          },
        ],
        default: 'evaluation',
        required: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Evaluate',
            value: 'evaluate',
          },
        ],
        default: 'evaluate',
        required: true,
      },
      {
        displayName: 'Question',
        name: 'question',
        type: 'string',
        default: '',
        required: true,
        description: 'The question that was asked to the AI agent',
        displayOptions: { show: { resource: ['evaluation'], operation: ['evaluate'] } },
      },
      {
        displayName: 'Ground Truth',
        name: 'ground_truth',
        type: 'string',
        default: '',
        required: true,
        description: 'The expected correct answer for comparison',
        displayOptions: { show: { resource: ['evaluation'], operation: ['evaluate'] } },
      },
      {
        displayName: 'Answer',
        name: 'answer',
        type: 'string',
        default: '',
        required: true,
        description: 'The answer provided by the AI agent',
        displayOptions: { show: { resource: ['evaluation'], operation: ['evaluate'] } },
      },
      {
        displayName: 'Context',
        name: 'context',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Context for the evaluation',
        displayOptions: { show: { resource: ['evaluation'], operation: ['evaluate'] } },
      },
      {
        displayName: 'Conversation ID',
        name: 'conversation_id',
        type: 'string',
        default: '',
        description: 'The conversation identifier',
        displayOptions: { show: { resource: ['evaluation'], operation: ['evaluate'] } },
      },
      {
        displayName: 'Evaluation Group ID',
        name: 'eval_group_id',
        type: 'string',
        default: '',
        required: true,
        description: 'The evaluation group identifier',
        displayOptions: { show: { resource: ['evaluation'], operation: ['evaluate'] } },
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'string',
        default: 'S',
        required: true,
        description: 'Evaluation type identifier (single character)',
        displayOptions: { show: { resource: ['evaluation'], operation: ['evaluate'] } },
      },
    ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
          const question = this.getNodeParameter('question', i) as string;
          const groundTruth = this.getNodeParameter('ground_truth', i) as string;
          const answer = this.getNodeParameter('answer', i) as string;
          const conversationId = this.getNodeParameter('conversation_id', i) as string;
          const evalGroupId = this.getNodeParameter('eval_group_id', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const contextValue = this.getNodeParameter('context', i) as string;

          const requestBody = {
            question,
            ground_truth: groundTruth,
            answer,
            context: contextValue,
            conversation_id: conversationId,
            eval_group_id: evalGroupId,
            type,
          };

          const ragmetricsData = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'ragmetricsApi',
            {
              method: 'POST',
              url: 'https://api.ragmetrics.ai/v2/single-evaluation/',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: requestBody,
              json: true,
            },
          );

          const runId =
            ragmetricsData.run_id !== undefined && ragmetricsData.run_id !== null
              ? Number(ragmetricsData.run_id)
              : undefined;
          const singleRecordId =
            ragmetricsData.single_record_id !== undefined && ragmetricsData.single_record_id !== null
              ? Number(ragmetricsData.single_record_id)
              : undefined;
          const recordId =
            ragmetricsData.record_id !== undefined && ragmetricsData.record_id !== null
              ? Number(ragmetricsData.record_id)
              : undefined;

          // Build the response object
          const responseData: any = {
            message: ragmetricsData.message,
            status: ragmetricsData.status,
          };

          // Include task_id if present (for backward compatibility)
          if (ragmetricsData.task_id !== undefined) {
            responseData.task_id = ragmetricsData.task_id;
          }

          // Include run_id if present
          if (runId !== undefined) {
            responseData.run_id = runId;
          }

          // Include single_record_id if present (for backward compatibility)
          if (singleRecordId !== undefined) {
            responseData.single_record_id = singleRecordId;
          }

          // When status is "success", include additional fields
          if (ragmetricsData.status === 'success') {
            // Include results array if present
            if (ragmetricsData.results !== undefined && Array.isArray(ragmetricsData.results)) {
              responseData.results = ragmetricsData.results;
            }

            // Include conversation_id if present
            if (ragmetricsData.conversation_id !== undefined) {
              responseData.conversation_id = ragmetricsData.conversation_id;
            }

            // Include record_id if present
            if (recordId !== undefined) {
              responseData.record_id = recordId;
            }
          }

          returnData.push({
            json: responseData,
            pairedItem: {
              item: i,
            },
          });
        } catch (error) {
          const errorMessage = (error as Error).message;
          const errorResponse = (error as any).response;

          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: errorMessage,
                statusCode: errorResponse?.statusCode,
                responseBody: errorResponse?.body,
              },
              pairedItem: {
                item: i,
              },
            });
          } else {
            throw new NodeApiError(this.getNode(), error as any);
          }
        }
      }

    return [returnData];
  }
}


