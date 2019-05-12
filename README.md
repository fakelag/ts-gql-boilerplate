# Full-Stack boilerplate

A project skeleton for full-stack web development using TypeScript, GraphQL, MongoDB and React.

## Languages
* TypeScript
* Scss

## Setup
```shell
git clone https://github.com/fakelag/ts-gql-boilerplate.git
cd ts-gql-boilerplate

npm install
```

## Running scripts
* `npm run start` - deploys a development instance
* `npm run production` - deploys a production instance
* `npm run build` - builds an optimized production bundle (WIP)
* `npm run tests` - runs jest tests
* `npm run clean` - cleans tsc build directory

## Backend
### Libraries
| Part  | Tech |
| ------------- | ------------- |
| Server | NodeJs/Express |
| Database | MongoDB/Mongoose |
| Communication | GraphQL |
| Authentication | (None) |
| Tests | Jest |

### Configuration
| Config  | Path |
| ------------- | ------------- |
| Main Config | backend/config.json |
| Databases | backend/database.ts |
| GQL | backend/schema.graphql |
| Babel | config/babel.config.js |
| WebPack | config/webpack.config.js |
| Jest | config/jest.config.js |

### Backend notes
* To start development, configure mutations and subscriptions in `backend/backend.ts` & `backend/schema.graphql`
* Backend only includes a http server, secure connections/certificates should be handled via a reverse proxy
* For multipart upload support (outside graphql) install multer (https://www.npmjs.com/package/multer)
* Backend interface definitions can be found in `backend/interfaces.ts`
* Mockup authentication can be found in `backend/server.ts`
* NPM Scripts are currently configured for a Win32 environment -- slight changes may be required to get them working on other systems

## Frontend
### Libraries
| Part  | Tech |
| ------------- | ------------- |
| Core | React |
| History | React Router |
| Communication | GraphQL |
| Styles | Sass |
| Tests | (none) |

### Frontend notes
* Shared configuration (via webpack) can be accessed from `window.config`
* GQL subscriptions, client and cache can be imported from `frontend/link.tsx`
* Packed resources (images, icons, etc) can be imported from `resources/`
* Frontend interface definitions can be found at `frontend/interfaces.ts`

## Other
|  |  |
| ------------- | ------------- |
| Webpack | ✓ |
| Cookie sessions | ✓ |
| GQL Uploads | ✓ |
| GQL Subscriptions | ✓ |
| GQL Transport | HTTP/HTTPS/WS |


## Todo List
* Add `passport` authentication support (+ Support for Google OAuth)
* Add clientside session timeout management
* Add some example development GQL endpoints
* Add an example GQL subscription
* Add a build script
* Refactor websocket state handling