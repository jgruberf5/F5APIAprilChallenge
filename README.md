# F5 API April Challenge!

This month we are going to encourage everyone to learn a little bit about the [OpenAPI]([https://www.openapis.org/](https://www.openapis.org/)) initiative. [OpenAPI](https://www.openapis.org/) attempts to create a vendor neutral description specification for request/response APIs.  It falls under the governance of the Linux Foundation.



There are dozens of [code generation tools](https://github.com/OpenAPITools/openapi-generator) which can consume [OpenAPI]([https://www.openapis.org](https://www.openapis.org)) YAML or JSON API descriptions and create client and server stubs in the programming language or service framework of your choice. The code generation tools typically annotate the API description document with mapping to specific methods or functions within the generated code.



The F5DX publishes its public APIs in OpenAPI version 3 documents.

## Your Challenge!

It's time for you to jump right in and implement a basic [OpenAPI](https://www.openapis.org/) REST web service. We'll provide the service specification document:

[swagger.yaml](https://raw.githubusercontent.com/jgruberf5/F5APIAprilChallenge/main/swagger.yaml)

There is an online editor which includes code generators if you want to use that to get started:

[Online Swgger Editor]([Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/jgruberf5/F5APIAprilChallenge/main/swagger.yaml))

You can implement your service in whatever programming language or service framework you want. 

We've created a test client which will test out the basic functionality of your service endpoint and report the results to us in the cloud! We're recording the timestamps of the first successful test run for each f5.com email address who submits results.

You'll have to go learn [OpenAPI](https://www.openapis.org/) yourself! There is enough detail in the API description document for you to complete your service. The API description includes the use of HTTP BASIC authentication to protect your endpoint paths. ***The username supplied by the client to your service must be your f5.com email address for you to get credit for your success!***. The test client will send a report to http://report.edgesite.cloud:5000 so please assure the client has Internet access to that host and port.

## The Test Client

The test client which reports your success can be run as either as a docker container or as a node JS application.

### The docker way

```
$ docker run -i -t --rm docker run -i -t --rm jgruberf5/f5apiaprilchallenge:latest
```

## The node way

```
$ git clone https://github.com/jgruberf5/F5APIAprilChallenge.git
$ cd F5APIAprilChallenge
$ npm install
$ npm run build
$ npm run start
```

You will need to supply it the following information:

* Your f5.com email address to use as a username to your service

* The password to use for your service

* The host (IP address or resolvable DNS name) for your service

* The TCP port for your service



## Happy API April!
