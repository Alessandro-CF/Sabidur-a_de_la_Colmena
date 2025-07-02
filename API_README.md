# API Documentation - Sabiduría de la Colmena

## Authentication

The API uses Laravel Sanctum for authentication. To authenticate:

1. Get a token by making a POST request to `/api/tokens/create` with:
   ```json
   {
     "email": "your-email@example.com",
     "password": "your-password",
     "device_name": "device-name"
   }
   ```

2. Use the token in all authenticated requests with the Authorization header:
   ```
   Authorization: Bearer YOUR_TOKEN
   ```

3. To revoke tokens:
   - All tokens: DELETE `/api/v1/tokens/revoke-all`
   - Specific token: DELETE `/api/v1/tokens/revoke/{tokenId}`

## Public Endpoints

These endpoints don't require authentication:

### Publicaciones (Posts)

- GET `/api/v1/comunidad/publicaciones` - List all posts
- GET `/api/v1/comunidad/publicaciones/{id}` - Get a specific post

- GET `/api/v1/categorias` - List all categories
- GET `/api/v1/categorias/{id}` - Get a specific category

## Protected Endpoints

These endpoints require authentication:

### Publicaciones (Posts)

- POST `/api/v1/comunidad/publicaciones` - Create a new post
  ```json
  {
    "titulo": "Post title",
    "contenido": "Post content",
    "imagen": [file upload]
  }
  ```

- PUT `/api/v1/comunidad/publicaciones/{id}` - Update a post
  ```json
  {
    "titulo": "Updated title",
    "contenido": "Updated content",
    "imagen": [file upload - optional]
  }
  ```

- DELETE `/api/v1/comunidad/publicaciones/{id}` - Delete a post

- POST `/api/v1/comunidad/publicaciones/{id}/like` - Like/unlike a post
- POST `/api/v1/comunidad/publicaciones/{id}/guardar` - Save/unsave a post
- GET `/api/v1/comunidad/publicaciones/usuario/mis-publicaciones` - Get user's posts
- GET `/api/v1/comunidad/publicaciones/usuario/guardados` - Get user's saved posts

### Notificaciones (Notifications)

- GET `/api/v1/comunidad/notificaciones` - Get all notifications
- GET `/api/v1/comunidad/notificaciones/count` - Count unread notifications
- POST `/api/v1/comunidad/notificaciones/{id}/leer` - Mark notification as read
- POST `/api/v1/comunidad/notificaciones/leer-todas` - Mark all notifications as read

## Response Format

All responses follow this structure:

```json
{
  "data": [ ... ],
  "message": "Success message"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

## Status Codes

- 200: OK - Request succeeded
- 201: Created - Resource created
- 400: Bad Request - Invalid data
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - Not allowed to access resource
- 404: Not Found - Resource not found
- 422: Unprocessable Entity - Validation failed
- 500: Server Error - Something went wrong on the server
