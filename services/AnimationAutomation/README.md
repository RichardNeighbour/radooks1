# AnimationAutomation Service

This service is responsible for converting storylines into animated video files using FFmpeg. It is part of the Radooks platform, which automates the creation of animated series from simple user-provided ideas.

## API Endpoint

POST `/create-animation`
Content-Type: `application/json`
Body: `{ "storyline": { "title": "Title", "plot": "Plot details", "characters": ["Character 1", "Character 2"] } }`

The service receives a storyline JSON object and converts it into an animated video file, returning the path to the generated file.

## Response Format

Upon successful creation of the animation, the service will respond with a JSON object containing the URL of the generated video file. The response format will be as follows:

```
{
  "message": "Video creation successful",
  "videoURL": "http://<your-server-address>:<port>/output/animation.mp4"
}
```

This URL can be used to access and view the generated animation video. Replace `<your-server-address>` and `<port>` with your actual server address and port.

## Input Validation

To ensure the security and integrity of the data being processed, all inputs to the `/create-animation` endpoint are validated against a predefined schema. This validation checks for the correct structure and data types of the storyline object, including the title, plot, and characters.

## Error Handling

The service includes comprehensive error handling to manage and respond to various error conditions gracefully. This includes errors during video processing, such as issues with input formats or problems encountered during the FFmpeg operation. Detailed error messages are provided to assist in diagnosing and resolving issues.

## Logging and Monitoring

Operational logging is implemented throughout the service to monitor its performance and to quickly identify and troubleshoot issues. This includes logging of request details, processing steps, and any errors encountered. The logs are structured and stored securely for analysis.

## Security Measures

Security is a priority for the AnimationAutomation service. Measures implemented include input validation, secure handling of errors without exposing sensitive information, and adherence to best practices for secure service development.

## Documentation Update

This documentation has been updated to include detailed information on how to interact with the service, including the expected input format, output details, and descriptions of the security features and error handling mechanisms added. Users and developers are encouraged to review this documentation thoroughly to ensure successful interaction with the service.

## Important Note

This service runs on port 3002. Ensure you are sending requests to the correct service and port. The Radooks platform also includes the AIStoryGenerator service, which runs on port 3001 and is responsible for expanding user prompts into detailed storylines. Make sure to interact with the correct service based on your needs.

For developers and users of the Radooks platform, it's crucial to understand the distinct functionalities provided by each service to ensure proper interaction and utilization of the platform's capabilities. When sending requests, please verify you are targeting the correct port and endpoint. For storyline generation, use the AIStoryGenerator service on port 3001 with the endpoint `/generate`. For converting these storylines into animated videos, direct your requests to the AnimationAutomation service on port 3002 using the `/create-animation` endpoint. This clarification aims to prevent confusion and ensure smooth operation within the Radooks ecosystem.