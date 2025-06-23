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
   - All tokens: DELETE `/api/tokens/revoke-all`
   - Specific token: DELETE `/api/tokens/revoke/{tokenId}`

## Public Endpoints

These endpoints don't require authentication:

### Publicaciones (Posts)

- GET `/api/v1/publicaciones` - List all posts
- GET `/api/v1/publicaciones/{id}` - Get a specific post

### Productos (Products)

- GET `/api/v1/productos` - List all products
- GET `/api/v1/productos/{id}` - Get a specific product

### Categorías (Categories)

- GET `/api/v1/categorias` - List all categories
- GET `/api/v1/categorias/{id}` - Get a specific category

## Protected Endpoints

These endpoints require authentication:

### Publicaciones (Posts)

- POST `/api/v1/publicaciones` - Create a new post
  ```json
  {
    "titulo": "Post title",
    "contenido": "Post content",
    "imagen": [file upload]
  }
  ```

- PUT `/api/v1/publicaciones/{id}` - Update a post
  ```json
  {
    "titulo": "Updated title",
    "contenido": "Updated content",
    "imagen": [file upload - optional]
  }
  ```

- DELETE `/api/v1/publicaciones/{id}` - Delete a post

- POST `/api/v1/publicaciones/{id}/like` - Like/unlike a post
- POST `/api/v1/publicaciones/{id}/guardar` - Save/unsave a post
- GET `/api/v1/publicaciones/usuario/mis-publicaciones` - Get user's posts
- GET `/api/v1/publicaciones/usuario/guardados` - Get user's saved posts

### Notificaciones (Notifications)

- GET `/api/v1/notificaciones` - Get all notifications
- GET `/api/v1/notificaciones/count` - Count unread notifications
- POST `/api/v1/notificaciones/{id}/leer` - Mark notification as read
- POST `/api/v1/notificaciones/leer-todas` - Mark all notifications as read

### Other Resources

The following resources are available as standard REST endpoints with the following operations:
- GET (index) - List all resources
- GET (show) - Get a specific resource
- POST - Create a new resource
- PUT/PATCH - Update a resource
- DELETE - Delete a resource

Available resources:
- `/api/v1/pedidos`
- `/api/v1/detalle-pedidos`
- `/api/v1/consultas`
- `/api/v1/asesorias`
- `/api/v1/articulos`
- `/api/v1/categoria-articulos`

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
