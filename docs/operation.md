# Operation

The TaskCare web client is generally operated on-premise. Because it is written
with [Next.js](https://nextjs.org/) as SSR (Server Side Rendering) application, it
requires a proper [Node.js](https://nodejs.org/) runtime environment to run.

## System Environment

The web client has almost zero dependencies to third-party services and is
operated on-premise. The only external service the web client relies on is
obviously the [TaskCare API](https://github.com/MuellerConstantin/taskcare-api)
service itself. Therefore, this service must be present and available for
communication.

## Deployment

The web client can be deployed on any [Node.js](https://nodejs.org/) runtime
environment matching the version required in the [package.json](/package.json)
file. For a proper deployment, the application must also be configured properly
(See [Configuration](./configuration.md)).

### Standalone

Because the web client is written with [Next.js](https://nextjs.org/) as SSR
(Server Side Rendering) application, for a standalone deployment, the web client
must be deployed with [Node.js](https://nodejs.org/) runtime environment. Also the
[npm](https://www.npmjs.com/) package manager might be helpful for installing
dependencies and executing the web client.

#### Build application

For a custom configured deployment, a rebuild of the application is required. This
especially applies to web client configuration settings
(See [Configuration](docs/configuration.md)) like API endpoints and other settings
because these variables are loaded and hardcoded at build time.

For building the application, the [npm](https://www.npmjs.com/) package manager
can be used. First of all the required dependencies need to be installed:

```bash
npm install
```

Then the application can be built:

```bash
npm run build
```

#### Run application

For running the built application, the [npm](https://www.npmjs.com/) package manager
can also be used.

```bash
npm run start
```
