## RAGMETRICS 

Ragmetrics is a turnkey evaluationAI service that scores, analyzes, validates and monitors any AI-generated text in seconds. Plug Ragmetrics into your workflow to ensure accuracy, consistency, and quality—without needing extra reviewers. The system evaluates responses based on customizable criteria and provides detailed scoring and reasoning.
Ragmetrics has been proven to detect Hallucination in AI Agents and chat bots.

Visit: https://ragmetrics.ai/live-ai-evaluation

*Put your workflows and chat bots under the microscope and understand when they start to derail, hallucinate or degrade their accuracy.*

### Requirements

To configure you n8n node, you need a Ragmetrics API key. For that you have to register for the service at ragmetrics.ai. You will also need a LLM Provider API key.


### Understanding the evaluation process

The evaluation process is very simple. It compares an *answer* to a specific *question* to a *ground truth answer* in a *context* given. A *score* and *reasoning* is provided based on a *criteria* or criterion given to evaluate.

#### Inputs to the evaluation
- . **question:** The question that you want to evaluate. Example: *Which is capital of France?*

- . **answer:** This is the answer that is going to be evaluated. Example: *Paris*.

- . **ground_truth_answer**: This is the source of truth. It is used as rubric to for the evaluation process to score the criterion. Example: *The capital of France is Paris.*

- . **context:** Additional information that is used to evaluate. The context becomes more relevant in non-direct comparison criterion. As an example in cases of **hallucination:** The context is key to understand if the evaluated answer related to the conversation that has been happening. Example: *Paris is the capital and largest city of France, with an estimated population of 2,048,472 in January 2025 in an area of more than 105 km2 (41 sq mi).*

- . **Conversation ID:** The conversation is use to track the monitoring of different bots

- . **type:** This is the type of evaluation. 


- . **Conversation ID:** The conversation is use to track the monitoring of different bots

- . **Evaluation Group ID:** The evaluation group id can be obtained in the application @ ragmetrics.ai. It has to be preconfigured in the platform with the criteria needed to run the evaluations properly.

#### Example of a Information for an evaluation
```json

From Input to the Node:	
  "question": "What is the capital of France?",
  "answer": "Paris.",
  "ground_truth_answer": "Paris is the capital of France.",
  "context": "",

From Configuration:
	
  "type": "S",
  "conversation_id":"ChatBot1"

```
After the evaluation is completed almost in real time, the system returns the score for each of the metrics and the reasoning behind.


### Using the n8n Ragmetrics Module

***Configuration:*** The module requires the corresponding configuration:
	- Ragmetrics API Key: linked to you account in ragmetrics.ai
	- Type of Evaluation: S - Simple, or C- Conversational
	- Conversation ID: user created indicator to monitor different conversations
	- Evaluation Group ID: obtained from the ragmetrics.ai application, used to monitor different groups of AI agents

***Input:*** You should provide the no de the fields needed for the evaluation:
	- question: question to answer
	- answer: answer that has to be evaluated
	- ground_truth_answer: source of truth for the answer to be evaluated
	- context: additional information to help the evaluation process
The inputs should be in Json Format.

Obtain the results and monitor what is going on with your tools!

Look for more information and examples in our website!!

support: support@ragmetrics.ai
website: ragmetrics.ai 
