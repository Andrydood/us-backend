/**
 * @swagger
 * /user/create:
 *    post:
 *      description: Creates a new user
 *      parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *            - username
 *          properties:
 *            email:
 *              type: string
 *              example: andrydood@itsus.com
 *            username:
 *              type: string
 *              example: andrydood
 *            password:
 *              type: string
 *              example: p455w0rd
 *            firstName:
 *              type: string
 *              example: Andrea
 *            lastName:
 *              type: string
 *              example: Casino
 *            bio:
 *              type: string
 *              example: My bio
 *            locationId:
 *              type: integer
 *              example: 1
 *            skillIds:
 *              type: array
 *              items:
 *                type: integer
 *                example: 1
 *      responses:
 *        201:
 *          description: User Created
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                example: KUrA_I3K
 * /user/login:
 *    post:
 *      description: Logs a user in and returns a token
 *      parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *              example: andrydood@itsus.com
 *            password:
 *              type: string
 *              example: p455w0rd
 *      responses:
 *        200:
 *          description: User Logged In
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *                example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvbnpvIi...
 * /user/{username}:
 *    get:
 *      description: Returns user data for given username (Requires being authenticated)
 *      parameters:
 *      - name: username
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *          example: andrydood
 *      responses:
 *        200:
 *          description: User Data
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: andrydood
 *              id:
 *               type: string
 *               example: isdji
 *              first_name:
 *                type: string
 *                example: Andrea
 *              last_name:
 *                type: string
 *                example: Casino
 *              bio:
 *                type: string
 *                example: My bio
 *              location:
 *                type: string
 *                example: London
 *              skills:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      example: dancing
 *                    id:
 *                      type: integer
 *                      example: 1
 */
