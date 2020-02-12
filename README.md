# commands
start express server on :3001

```
npm run server
```
run server on :3001 and client devserver on :3000 with concurrently
```
npm run dev
```
biuld client app and run server
```
npm run prod
```

# environment variables
- NODE_ENV
- HOST_URL
- CLIENT_PORT
- SERVER_PORT
- DB_HOST_URL
- DB_NAME
- DB_USER
- DB_PASSWORD
- SERVICE_URL

# exposed api
- GET : **channels/** returns a list of registered channels on a system
- POST : **channel/123 {...}** creates a channel with the ID 123 using the body data
- GET : **channel/123** returns the details of channel 123
- DELETE : **channel/123** deletes channel 123

# todo
- MVC redesign
- GET : **channels/?q=1,2,3** returns a list of specified channels
- PUT : **channel/123 {...}** updates channel 123 with the body data
- token implementation
- ... frontend