# Fastify Boilerplate 
This repository contains a ideal starting point for RESTFUL API development. It demonstrates, how to interact with Postgres, Redis, ENV's while maintaining distinct layers and separation of concerns. 

## Setup
### Requirements 
- Node.js > version 25
- Docker/Podman/OCI image runner

### Application 

```bash 
npm i
cp .env.example .env 
```
** .env.example value match defaults or supporting containers variables

### Supporting Containers 
This stage is not necessary if you have your own Postgres and/or Redis services. Change .env variables to match your infrastructure. 

```bash 
docker up
```
The application requires the database schema declared in `/database/001_schema.up.sql`. Execute this on your Postgres instance. 

## Running 
### API 
```bash
npm run build
npm run start
``` 
When the API is running OpenAPI documentation is available at http://localhost:8080/documentation. The YAML spec is available [here](http://localhost:8080/documentation/yaml) when running or [here in the repo](./server.yaml)


## Testing

### Unit Testing
Provided by ViTest 
```bash
npm run test
```
With Coverage: 
```bash
npm run test-coverage
```


### Integration Testing
Provided by Bruno. Manual runs. Ensure the API is running.

You require [Bruno-CLI](https://docs.usebruno.com/bru-cli/overview) standalone or with [Bruno VS code extension](https://marketplace.visualstudio.com/items?itemName=bruno-api-client.bruno) to run

<strong> CLI </strong> 
```bash 
npm run integration
```
or
```bash 
npm run integration-coverage
```
or
```bash
cd ./src/__tests__/integration
bru run --reporter-junit ../../../coverage/bruno-results.xml
```

<strong>VS Code</strong> 

[Market Place](https://marketplace.visualstudio.com/items?itemName=bruno-api-client.bruno)

Add `./src/__tests__/api-client/boilerplate` as a collection. 
<br>
Run individually, by directory or the entire collection. 



## TODO: 
- [ ] Fix duplication of schema's used between roots.                
        User and Error schema's should be in components and referenced 
- [x] Use .env variables in the application 
    - [x] Set up 
    - [x] Use variables in server initialization 
- [x] Add mqtt for event based transports 
    - [x] Publish message on entity create, update, delete events
