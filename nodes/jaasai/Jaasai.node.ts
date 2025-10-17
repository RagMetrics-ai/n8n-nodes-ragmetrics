
import type { NodeConnectionType } from 'n8n-workflow';

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  //NodeApiError,
  NodeOperationError,
} from 'n8n-workflow';

export class Jaasai implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'JaaS AI',
    name: 'jaasai',
    icon: 'file:jaas_icon.svg',
    group: ['transform'],
    version: 1,
    description: 'Evaluate AI Agents with JaaS',
    defaults: {
      name: 'JaasAi',
    },
    inputs: ['main' as NodeConnectionType],
    outputs: ['main' as NodeConnectionType],
    credentials: [
      {
        name: 'jaasaiApi',
        required: true,
      },
    ],
    properties: [

			{
  			displayName: 'Evaluation Criteria #1',
  			name: 'criteria1',
  			type: 'string',
  			default: 'Accuracy',
  			//required: false,
			},
			{
  			displayName: 'Evaluation Criteria #2',
  			name: 'criteria2',
  			type: 'string',
  			default: '',
  			//required: false,
			},
			{
  			displayName: 'Evaluation Criteria #3',
  			name: 'criteria3',
  			type: 'string',
  			default: '',
  			//required: false,
			},
		{
  			displayName: 'Evaluation Criteria #4',
  			name: 'criteria4',
  			type: 'string',
  			default: '',
  			//required: false,
			},
			{
  			displayName: 'Evaluation Criteria #5',
  			name: 'criteria5',
  			type: 'string',
  			default: '',
  			//required: false,
			},

			{
				displayName: 'Type of Evaluation',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'Simple',
						value: 'S',
					},
					{
						name: 'Conversational (S)',
						value: 'D',
					},
					{
						name: 'Verified',
						value: 'V',
					},
				],
				default: 'S',
				//required: false,
			},
			// Added this for testing.
			{

				displayName: 'Evaluation Fields: Question',
				name: 'question',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Answer',
				name: 'answer',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Ground Truth Answer',
				name: 'ground_truth_answer',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Context',
				name: 'context',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Cohort',
				name: 'cohort',
				type: 'string',
				default: 'N8N-NC',
			},
    ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Collect data from all input items to create one complete set
    let question = "";
    let answer = "";
    let context = "";
    let ground_truth_answer = "";
    let cohort = "N8N-NC";

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Collect data from input items first, then fall back to node parameters
      if (item.json.chatInput && !question) question = String(item.json.chatInput);
      if (item.json.output && !answer) answer = String(item.json.output);
      if (item.json.context && !context) context = String(item.json.context);
      if (item.json.ground_truth_answer && !ground_truth_answer) ground_truth_answer = String(item.json.ground_truth_answer);
      if (item.json.cohort && cohort === "N8N-NC") cohort = String(item.json.cohort);

      // Fall back to node parameters if not found in input data
      if (!question) question = String(this.getNodeParameter('question', i) || "");
      if (!answer) answer = String(this.getNodeParameter('answer', i) || "");
      if (!context) context = String(this.getNodeParameter('context', i) || "");
      if (!ground_truth_answer) ground_truth_answer = String(this.getNodeParameter('ground_truth_answer', i) || "");
      if (cohort === "N8N-NC") cohort = String(this.getNodeParameter('cohort', i) || "N8N-NC");
    }

    try {
      const evaluation_criteria1 = this.getNodeParameter('criteria1', 0) as string || "Accuracy";
      const evaluation_criteria2 = this.getNodeParameter('criteria2', 0) as string || "";
      const evaluation_criteria3 = this.getNodeParameter('criteria3', 0) as string || "";
      const evaluation_criteria4 = this.getNodeParameter('criteria4', 0) as string || "";
      const evaluation_criteria5 = this.getNodeParameter('criteria5', 0) as string || "";

      const evaluation_criteria = [evaluation_criteria1, evaluation_criteria2, evaluation_criteria3, evaluation_criteria4, evaluation_criteria5]
        .filter(c => c && c.trim() !== "");

      const type = this.getNodeParameter('type', 0) as string;

      const credentials = await this.getCredentials('jaasaiApi');
      const apiKey = credentials.apiKey as string;
      if (apiKey === undefined) {
        throw new NodeOperationError(this.getNode(), 'No API key provided!');
      }

      // Fetch the data from the JaaS API - single call with collected data
      const jaasData = await this.helpers.httpRequestWithAuthentication.call(
        this,
        'jaasaiApi', // credential name
        {
          method: 'POST',
          url: 'https://api.jaas-ai.com/v1/evaluate',
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
          },
          body: {
            'question': question,
            'ground_truth_answer': ground_truth_answer,
            'answer': answer,
            'context': context,
            'evaluation_criteria': evaluation_criteria,
            'type': type,
            'cohort': cohort,
          },
          json: true,
        }
      );

      returnData.push({
        json: {
          'status': jaasData.status,
          'criteria': jaasData.criteria,
          'type': jaasData.evaluation_type,
        },
        pairedItem: {
          item: 0,
        },
      });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: {
            error: error.message,
          },
          pairedItem: {
            item: 0,
          },
        });
      } else {
        throw new NodeOperationError(this.getNode(), error);
      }
    }

    return [returnData];
  }
}

