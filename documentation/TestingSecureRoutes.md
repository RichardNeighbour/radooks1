# Testing Secure Routes with Stateless HTTP Clients

When working with secure routes in our application, especially those that require session-based authentication, it's crucial to understand how to properly test these using tools that might not automatically handle cookies, such as cURL or Postman. This document provides guidance on how to manually handle session cookies for testing purposes.

## Using Postman

1. First, ensure you are logged in through the application's login route. This can typically be done by sending a POST request to `/auth/login` with the required credentials (username and password). Make sure to use the correct content type (e.g., `application/json`) in your request header.

2. Upon a successful login, the server will set a session cookie. In Postman, this cookie is automatically included in the "Cookies" section of the response. For subsequent requests to secure routes, Postman will handle this cookie automatically, sending it along with your requests as long as you are using the same Postman instance.

## Using cURL

Testing with cURL requires manually handling the session cookie. Here's how you can do it:

1. Login using cURL by sending a POST request to the login route (`/auth/login`). You'll need to include your login credentials in the request body. Example:
   ```
   curl -c cookies.txt -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username": "yourUsername", "password": "yourPassword"}'
   ```
   This command uses the `-c cookies.txt` option to save the session cookie to a file named `cookies.txt`.

2. To make a request to a secure route, use the saved cookie by including it with the `-b` option. Example:
   ```
   curl -b cookies.txt -X POST http://localhost:3000/api/series -H "Content-Type: application/json" -d '{"title": "Test Series", "description": "A test series description", "episodes": [{"episodeNumber": 1, "title": "Episode 1", "url": "http://example.com/episode1"}]}'
   ```
   This command reads the session cookie from `cookies.txt` and includes it in the request, allowing you to authenticate against secure routes.

## Notes

- Ensure that your API endpoints are correctly configured to read and validate session cookies.
- Always test your secure routes using a tool that allows you to manually manage cookies if automatic handling is not supported.
- For real-world applications, consider using OAuth or token-based authentication for API access, as these methods are more suited for stateless HTTP clients.

Remember, when testing secure routes, the key is to simulate the same behavior a browser would perform automatically - managing session cookies. By following the steps above, you can effectively test your application's secure routes using any HTTP client tool.