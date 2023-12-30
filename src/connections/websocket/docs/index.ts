/**
 * @openapi
 *  /ws - connect:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - websocket
 *      description: Connect to the webSocket endpoint.
 *      responses:
 *        200:
 *          description: WebSocket connection established
 *        401:
 *          description: User not logged in
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */

/**
 * @openapi
 *  /ws - get messages:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - websocket
 *      description: Request to get user chat messages
 *      requestBody:
 *        description: Request body getting user messages
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IGetMessageDto'
 *      responses:
 *        200:
 *          description: Get back all user messages,
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/IUserMessagesEntity'
 *        401:
 *          description: User not logged in
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */

/**
 * @openapi
 *  /ws - read message:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - websocket
 *      description: Read message.
 *      requestBody:
 *        description: Request body read user chat message
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IReadMessageDto'
 *      responses:
 *        200:
 *          description: Read user message,
 *          type: object
 *          properties:
 *            type:
 *              type: string
 *              example: 'confirmation'
 *        401:
 *          description: User not logged in
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */

/**
 * @openapi
 *  /ws - get unread:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - websocket
 *      description: Get unread chat message.
 *      requestBody:
 *        description: Request body to get unread messages
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IGetMessageDto'
 *      responses:
 *        200:
 *          description: Get back unread user messages,
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/IUserMessagesEntity'
 *        401:
 *          description: User not logged in
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */

/**
 * @openapi
 *  /ws - get detailed:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - websocket
 *      description: Get chat messages from 1 conversion with details.
 *      requestBody:
 *        description: Request body to get detailed messages
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IGetDetailedDto'
 *      responses:
 *        200:
 *          description: Get back user messages with details,
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/IDetailedMessagesEntity'
 *        401:
 *          description: User not logged in
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */

/**
 * @openapi
 *  /ws - send:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - websocket
 *      description: Get chat message.
 *      requestBody:
 *        description: Request body to send message
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IGetDetailedDto'
 *      responses:
 *        200:
 *          description: Get back all user messages,
 *        401:
 *          description: User not logged in
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */
