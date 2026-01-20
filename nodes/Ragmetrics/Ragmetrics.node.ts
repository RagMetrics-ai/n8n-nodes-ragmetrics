
import type { NodeConnectionType } from 'n8n-workflow';

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  //NodeApiError,
  NodeOperationError,
} from 'n8n-workflow';

export class Ragmetrics implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Ragmetrics',
    name: 'ragmetrics',
    icon: 'file:Ragmetrics_blue.svg',
    group: ['transform'],
    version: 1,
    description: 'Ragmetrics: Evaluate AI agents and outputs',
    defaults: {
      name: 'Ragmetrics',
    },
    inputs: ['main' as NodeConnectionType],
    outputs: ['main' as NodeConnectionType],
    credentials: [
      {
        name: 'ragmetricsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Question',
        name: 'question',
        type: 'string',
        default: '',
        required: true,
        description: 'The question that was asked to the AI agent',
      },
      {
        displayName: 'Ground Truth',
        name: 'ground_truth',
        type: 'string',
        default: '',
        required: true,
        description: 'The expected correct answer for comparison',
      },
      {
        displayName: 'Answer',
        name: 'answer',
        type: 'string',
        default: '',
        required: true,
        description: 'The answer provided by the AI agent',
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
      },
      {
        displayName: 'Conversation ID',
        name: 'conversation_id',
        type: 'string',
        default: '',
        description: 'The conversation identifier',
      },
      {
        displayName: 'Evaluation Group ID',
        name: 'eval_group_id',
        type: 'string',
        default: 'd5ec449f-a88d-4093-a1db-3297d379a638',
        description: 'The evaluation group identifier',
      },
			{
        displayName: 'Type',
        name: 'type',
        type: 'string',
        default: 'S',
        required: true,
        description: 'Evaluation type identifier (single character)',
      },
    ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
			let t = items.length;
			if (items.length>1) t=1;
      for (let i = 0; i < t; i++) {
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

          // Debug logging
          this.logger.debug('Ragmetrics Request Details', {
            url: 'https://api.ragmetrics.ai/v2/single-evaluation/',
            method: 'POST',
            body: requestBody,
          });

          // Get credentials for debugging (masked)
          const credentials = await this.getCredentials('ragmetricsApi');
          const apiKeyPreview = credentials.apiKey
            ? `${(credentials.apiKey as string).substring(0, 10)}...`
            : 'NOT SET';
          this.logger.debug('API Key (masked)', { apiKey: apiKeyPreview });

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
          // Enhanced error logging
          const errorMessage = (error as Error).message;
          const errorResponse = (error as any).response;

          this.logger.error('Ragmetrics Request Failed', {
            error: errorMessage,
            statusCode: errorResponse?.statusCode,
            statusText: errorResponse?.statusText,
            responseBody: errorResponse?.body,
            responseHeaders: errorResponse?.headers,
          });

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
            throw new NodeOperationError(this.getNode(), error);
          }
        }
      }

    return [returnData];
  }
}


