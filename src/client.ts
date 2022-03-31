import { ComputeApi } from "./generated-sources/openapi/api";

import { MathRequest } from "./generated-sources/openapi/model/mathRequest";
import { KeyValue } from "./generated-sources/openapi/model/keyValue";
import { MetadataType } from './generated-sources/openapi/model/metadataType';

import chalk from 'chalk';
import { MathResponse } from './generated-sources/openapi/model/mathResponse';

const prompts = require('prompts');
const fs = require('fs');
const crypto = require('crypto');
const request = require('request');

const reportUrl = 'http://127.0.0.1:5000/create'

const config = {
    email: '',
    password: '',
    host: 'localhost',
    port: 8183
};

config.email = process.env.EMAIL || '';
config.password = process.env.PASSWORD || '';
config.host = process.env.HOST || 'localhost';
config.port = parseInt(process.env.PORT) || 8183

let api:ComputeApi = null;
let computeResults:MathResponse[] = [];

const testFailed = (reason: string) => {
    process.stdout.write(chalk.redBright(' - FAILED: ') + chalk.red(reason) + '\n');
    process.exit(1);
}

const connectToAPI = async () => {
    const userAnswers = [
        {
            type: 'text',
            name: 'email',
            message: chalk.yellow('Your f5 email address:'),
            default: config.email
        },
        {
            type: 'password',
            name: 'password',
            message: chalk.yellow('Password for your API:'),
            default: config.email
        },
        {
            type: 'text',
            name: 'host',
            message: chalk.yellow('API Host:'),
            initial: config.host
        },
        {
            type: 'number',
            name: 'port',
            message: chalk.yellow('API Port:'),
            initial: config.port
        }
    ]
    let response = await prompts(userAnswers);
    config.email = response.email
    config.password = response.password
    const baseUrl = "http://"+response.host+":"+response.port+"/api/v1";
    process.stdout.write(chalk.whiteBright('\nAPI endpoint: '+ baseUrl+'\n\n'));
    api = new ComputeApi(baseUrl);
}

const testBasicAuthImplemented = async () => {
    // First test if they got the basic auth and error messages correct
    process.stdout.write(chalk.blue('testing basic Authentication is implemented'));
    await api.computeGet().catch((error) => {
        if(error.statusCode != 401) {
            testFailed('implement basic Auth security');
        }
        try {
            if (! error.body.hasOwnProperty('code')) {
                testFailed('all error messages should be ErrorResponse objects')
            } else {
                if (error.body.code != 401) {
                    testFailed('ErrorResponse code not correct, should be 401')
                }
            }
            if (! error.body.hasOwnProperty('message')) {
                testFailed('all error messages should be ErrorResponse objects')
            }
        } catch(err) {
            testFailed('authentication error response body was not as expected:' + err)
        }
    })
    process.stdout.write(chalk.green(' - PASSED!\n'));
    // Set password and try a get
    api.username = config.email
    api.password = config.password
    process.stdout.write(chalk.blue('testing basic Authentication'));
    await api.computeGet().catch((error) => {
        try {
            if (! error.body.hasOwnProperty('code')) {
                testFailed('all error messages should be ErrorResponse objects')
            }
            if (! error.body.hasOwnProperty('message')) {
                testFailed('all error messages should be ErrorResponse objects')
            }
        } catch(err) {
            testFailed('authentication error response body was not as expected:' + err)
        }
        testFailed('request error status code:' + error.body.code + ' - ' + error.message);
    })
    process.stdout.write(chalk.green(' - PASSED!\n'));
}

const addComputes = async () => {
    process.stdout.write(chalk.blue('testing Adding Computes'));
    const computes:MathResponse[] = []
    const operations = [
        MathRequest.OperationEnum.Add,
        MathRequest.OperationEnum.Subtract,
        MathRequest.OperationEnum.Multiply,
        MathRequest.OperationEnum.Divide
    ]
    for (let i=0; i<10; i++) {
        const mr = new MathRequest();
        mr.x = Math.floor(Math.random() * 100);
        mr.y = Math.floor(Math.random() * 100);
        mr.operation = operations[Math.floor(Math.random() * operations.length)];
        const labels: KeyValue[] = [];
        for (let z=0; z<10; z++) {
            const label = new KeyValue();
            label.key = 'key_' + i + '_' + z + '_' + mr.x;
            label.value = 'value_' + i + '_' + z + '_' + mr.y;
            labels.push(label);
        }
        const md = new MetadataType();
        md.labels = labels;
        mr.metadata = md;
        try {
            const mathResponse = await api.computePost(mr)
            computes.push(mathResponse.body)
        } catch (error) {
            testFailed(error)
        }
    }
    computeResults = computes;
    process.stdout.write(chalk.green(' - PASSED!\n'));
}

const getRandomMathResponse = () => {
    return computeResults[Math.floor(Math.random() * computeResults.length)];
}

const getComputeById = async () => {
    process.stdout.write(chalk.blue('getting a created Compute by id'));
    const randomCompute = getRandomMathResponse()
    const searchResults = await api.computeIdGet(randomCompute.id)
    if (searchResults.response.statusCode == 200) {
        const mathResponse:MathResponse = searchResults.body;
        if (mathResponse.id != randomCompute.id) {
            testFailed('GET request with id in path failed for id:' + randomCompute.id)
        }
    } else {
        testFailed('GET request with id returned: ' + searchResults.response.statusCode + ' instead of 200 for id:' + randomCompute.id)
    }
    process.stdout.write(chalk.green(' - PASSED!\n'));
}

const filterComputes = async () => {
    process.stdout.write(chalk.blue('filtering Computes by labels'));
    const randomCompute = getRandomMathResponse()
    const label = getRandomMathResponse().metadata.labels[Math.floor(Math.random()*randomCompute.metadata.labels.length)]
    const searchResults = await api.computeGet(label.key, 'equals', label.value);
    if (searchResults.response.statusCode == 200) {
        const mathResponses:MathResponse[] = searchResults.body;
        let matched:Boolean = false;
        mathResponses.map( (mathResponse) => {
            if (mathResponse.id == randomCompute.id) {
                matched = true;
            }
        })
        if (!matched) {
            testFailed('GET request filtered by label did not match any MathResults for label:' + label.key)
        }
    } else {
        testFailed('GET request filtered by label returned: ' + searchResults.response.statusCode + ' instead of match on label:' + label.key)
    }
    process.stdout.write(chalk.green(' - PASSED!\n'));
}

const deleteComputes = async () => {
    process.stdout.write(chalk.blue('deleting computes'));
    computeResults.map( async (computeResult) => {
        const deleteResults = await api.computeIdDelete(computeResult.id)
        if (deleteResults.response.statusCode != 202) {
            testFailed('DELETE request failed for id:' + computeResult.id)
        }
    })
    process.stdout.write(chalk.green(' - PASSED!\n'));
}

const sendChallengeResults = async () => {
    process.stdout.write(chalk.whiteBright('\nSending challenge results...'))
    const now = Date.now()
    const iso = new Date(now).toISOString()
    const fileBuffer = fs.readFileSync(__filename)
    const md5sum = crypto.createHash('md5')
    md5sum.update(fileBuffer)
    const results = {
        participant: config.email,
        completedTimeStamp: now,
        completedDate: iso,
        clientMD5: md5sum.digest('hex')
    }
    const requestOptions = {
        uri: reportUrl,
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        json: true,
        body: JSON.stringify(results)
    }
    request(requestOptions, (error:Error, response:any, body:any) => {
        if (!error && response.statusCode == 200) {
            if (body['status'] == 'created') {
                process.stdout.write(chalk.blueBright('..report create at ' + body['completedDate'] + '..'))
            } else {
                process.stdout.write(chalk.redBright('..existing report at ' + body['completedDate'] + '..'))
            }
        } else {
            testFailed(response.statusCode + '-' + error)
        }
        process.stdout.write(chalk.greenBright('Great Job!\n'));
    })
}

const runTests = () => {
    Promise.all([
        connectToAPI().then(() => {
            return testBasicAuthImplemented()
        }).then( () => {
            return addComputes()
        }).then( () => {
            return getComputeById()
        }).then( () => {
            return filterComputes()
        }).then( () => {
            return deleteComputes()
        }).then( () => {
            return sendChallengeResults()
        }).catch( (err) => {
            testFailed(err)
        })
    ]);
}

runTests();
