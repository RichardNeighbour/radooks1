# Known Issues in Radooks Project

## Deprecation Warning for `punycode` Module
- **Issue Description**: When starting the server, a deprecation warning is logged regarding the `punycode` module. This warning indicates that the `punycode` module, which is a part of Node.js core modules, is deprecated and suggests using a userland (third-party) alternative instead.
- **Impact**: This warning does not currently impact the functionality of the Radooks application. It appears to be a result of a dependency or sub-dependency within the project that utilizes the `punycode` module.
- **Current Status**: As of the latest project review, this issue remains unresolved due to the warning originating from a third-party dependency not directly controlled by the Radooks project codebase.
- **Recommended Action**: It is recommended to monitor the dependencies for updates that might remove the use of the deprecated `punycode` module. Additionally, project dependencies should be kept up-to-date by regularly running `npm update` to ensure any deprecated usage is minimized. After running `npm ls punycode`, if a direct dependency is identified as using `punycode`, check for an updated version of that dependency that does not use `punycode` and update accordingly. If the warning persists, document the findings and steps taken, suggesting keeping dependencies up to date as a potential solution until the dependencies themselves remove the usage of the deprecated module.
- **Workaround**: There is no immediate action required by developers or users of the Radooks project, as the deprecation warning does not affect the application's operation. However, developers should be aware of the warning when reviewing server logs to avoid confusion.

## Server Startup Clarity
- **Issue Description**: Feedback indicated confusion regarding the server startup process, specifically the lack of a clear message indicating successful server initialization and listening.
- **Impact**: The absence of a clear startup message may lead to uncertainty about whether the server has successfully started and is ready to handle requests.
- **Current Status**: This issue has been addressed by adding a console log statement within the `app.listen()` callback function in the `server.js` file, confirming the server's successful start and the port it is listening on.
- **Recommended Action**: Developers should ensure that the console log statement accurately reflects the port number by dynamically referencing the `process.env.PORT` environment variable. This ensures clarity and accuracy in server startup logs.
- **Implementation Details**: The implemented solution involves adding the following line of code in the `server.js` file within the `app.listen()` callback: `logger.info(\`Server successfully started and is listening on port ${process.env.PORT}\`);`. This change provides immediate visual confirmation of the server's operational status upon startup.

## Server Not Starting Issue
- **Issue Description**: Users reported that the server would not start, with no clear error message provided in the logs.
- **Impact**: This issue prevents the application from being used, as the server is essential for its operation.
- **Current Status**: Initial investigation did not reveal a direct cause related to the application's code or configuration. The issue might stem from environmental factors, such as misconfigured environment variables or issues with the MongoDB connection.
- **Recommended Action**: Developers should follow a systematic approach to diagnose the issue:
  1. Verify the presence of a console log statement in the `app.listen()` callback within `server.js` to confirm server startup.
  2. Ensure all required environment variables are correctly set in the `.env` file.
  3. Use `DEBUG=express:* node server.js` to enable detailed logging from Express, which might reveal more information about the startup issue.
  4. Check the MongoDB connection string and accessibility.
  5. Run `npm install` to ensure all dependencies are correctly installed and up to date.
  6. Review the entire `server.js` file for any syntax errors or misconfigurations.
  7. Add error handling in the database connection setup with mongoose in the `.connect` method's catch block to clearly indicate any failure to connect to the database and suggest checking the MongoDB connection string and ensuring MongoDB is accessible.
- **Workaround**: If the server still fails to start after following the recommended actions, developers should consider creating a minimal version of the application (stripping back to basic functionality) to isolate the issue.