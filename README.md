# F5 API April Challenge!

This month we are going to encourage everyone to learn about the [OpenAPI]([https://www.openapis.org/](https://www.openapis.org/)) initiative. [OpenAPI](https://www.openapis.org/) attempts to create a vendor neutral description specification for APIs. An [OpenAPI]([https://www.openapis.org/](https://www.openapis.org/)) document can include documentation, annotations for automation, and examples for your customers. There are frameworks to provide web user interfaces allowing your customers to discover your API through interacting with it.  [OpenAPI](%5Bhttps://www.openapis.org/%5D(https://www.openapis.org/)) falls under the governance of the [Linux Foundation](https://www.linuxfoundation.org/).

There are dozens of [code generation tools](https://github.com/OpenAPITools/openapi-generator) which can consume [OpenAPI]([https://www.openapis.org](https://www.openapis.org)) YAML or JSON API descriptions. These tools can create client and server stubs in the programming language or service framework of your choice. The code generation tools typically annotate the API description document with mapping to specific methods or functions within the generated code.

The F5XC publishes its [public APIs](https://docs.cloud.f5.com/docs/api) in [OpenAPI]([[https://www.openapis.org](https://www.openapis.org)) version 3 documents. In F5XC, the services are first described internally using a different specification, but F5DX code generation tools produces [OpenAPI]([[https://www.openapis.org](https://www.openapis.org)) specification documents for each API. We do this because it's a superior user experience for our customers compared to forcing them to consume tools or documentation in ways they are unfamiliar. 

## Your Challenge!

It's time to jump right in and implement a basic [OpenAPI](https://www.openapis.org/) REST web service for yourself. We'll provide the service specification document:

[swagger.yaml](https://raw.githubusercontent.com/jgruberf5/F5APIAprilChallenge/main/swagger.yaml)

There is an online editor which includes code generators if you want to use that to get started:

[Online Swgger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/jgruberf5/F5APIAprilChallenge/main/swagger.yaml)

You can implement your service in whatever programming language or service framework you want.

We've created a test client which will assure the basic functionality of your service endpoint and report the results to us in the cloud! We're recording the timestamps of the first successful test run for each f5.com email address. The clock is running!

You'll have to go learn [OpenAPI](https://www.openapis.org/) yourself! There is enough detail in the API description document for you to complete your service. 

The API description includes the use of HTTP BASIC authentication. ***The username supplied by the client to your service must be your f5.com email address for you to get credit for your success!***. 

The test client will send a report to http://report.edgesite.cloud:5000. Please assure the client has Internet access to that host and port to get credit for your work.

## The Test Client

The test client can be run as either as a docker container or as a node JS application.

### The docker way

```
$ docker run -i -t --rm jgruberf5/f5apiaprilchallenge:latest
```

### The node way

```
$ git clone https://github.com/jgruberf5/F5APIAprilChallenge.git
$ cd F5APIAprilChallenge
$ npm install
$ npm run build
$ npm run start
```

Please be aware that the code generation tools used by `npm run build` will require a Java JRE of at least Java 8 installed. Your node JS version must be
greater than node 12 as well.

### What the test client will need

You will need to supply the client with the following information:

* Your f5.com email address to use as a username to your service

* The password to your service

* The host (IP address or resolvable DNS name) for your service

* The TCP port for your service

Everything else you need is in the [service specification document](https://raw.githubusercontent.com/jgruberf5/F5APIAprilChallenge/main/swagger.yaml)! 


![](https://github.com/jgruberf5/F5APIAprilChallenge/raw/main/APIAprilChallenge.gif)

***image: the test client in action***

We'll be watching for the report of your success! The winners will have a brief code review session to make sure they didn't just rewrite the test client!

## Happy API April!
