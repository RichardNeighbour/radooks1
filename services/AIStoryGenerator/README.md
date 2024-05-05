# AIStoryGenerator Service

This service is part of the Radooks platform, designed to automate the creation of animated series from simple user-provided ideas. It specifically handles the expansion of user prompts into detailed storylines.

## API Endpoint

POST `/generate`
Content-Type: `application/json`
Body: `{ "prompt": "Your prompt here" }`

This endpoint accepts a user prompt and returns a detailed storyline based on the prompt. It's the first step in the content creation process within the Radooks platform.

## Important Note

This service runs on port 3001. It is crucial for users and developers interacting with the Radooks platform to send requests to the correct service and port based on the functionality they intend to use.

The Radooks platform also includes the AnimationAutomation service, which is responsible for converting the generated storylines into animated video files. The AnimationAutomation service runs on port 3002 and provides an API endpoint `/create-animation` for this purpose.

Please ensure you are sending your requests to the correct service:
- For expanding user prompts into storylines, use the AIStoryGenerator service on port 3001.
- For converting storylines into animated videos, use the AnimationAutomation service on port 3002.

For developers and users of the Radooks platform, understanding the distinct functionalities provided by each service is crucial to ensure proper interaction and utilization of the platform's capabilities. To avoid confusion and ensure smooth operation within the Radooks ecosystem, it is essential to verify you are targeting the correct port and endpoint. For storyline generation, direct your requests to the AIStoryGenerator service on port 3001 with the endpoint `/generate`. For converting these storylines into animated videos, direct your requests to the AnimationAutomation service on port 3002 using the `/create-animation` endpoint. This clarification aims to prevent confusion and ensure that users interact with the intended service for their specific needs.

To further clarify, the correct command to test the AnimationAutomation service and ensure it processes your request correctly should target port 3002. If you are attempting to use the `/create-animation` endpoint and your requests are not being processed as expected, please ensure you are directing your requests to port 3002, which is the designated port for the AnimationAutomation service. Incorrectly sending requests to the AIStoryGenerator service on port 3001 will result in errors, as that service does not handle animation creation. Always double-check the port and service endpoint you are targeting to avoid such issues.