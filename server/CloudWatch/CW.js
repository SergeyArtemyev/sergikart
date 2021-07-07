const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const cloudwatchlogs = new AWS.CloudWatchLogs();

class CW {
    constructor(params) {
        this.logGroupName = params.logGroupName;
        this.range = params.range;
        this.id = params.id;
        this.limit = params.limit;
        this.query = params.query;
        this.status = 'running';
        this.method = params.method;
        this.cashedId = '';
        this.logGroupNames = {
            payment: [
                '/aws/lambda/psp-dev-ecapzProcessAPayment',
                '/aws/lambda/ecapz-callback-api-dev-pspCallbacksPlatioResult',
                '/aws/lambda/psp-dev-ecapzGetPaymentStatus',
            ],
            payout: ['/aws/lambda/psp-dev-ecapzPayout', '/aws/lambda/psp-dev-ecapzPayoutStatus'],
        };
    }

    async getQueryId(params) {
        return await cloudwatchlogs.startQuery(params).promise();
    }

    configureQuery() {
        switch (this.query) {
            // date has 3 hour difference (maybe)
            case 'message':
                return {
                    endTime: Date.now(),
                    queryString: `
                      filter @${this.query} like '${this.id}'
                      | limit ${this.limit}
                      | sort @timestamp desc
                      `,
                    startTime: new Date().getTime() - 86400000 * this.range,
                    logGroupName: this.logGroupName,
                };
            case 'requestId':
                return {
                    endTime: Date.now(),
                    queryString: `
                      filter @${this.query} == '${this.id}'
                      | limit ${this.limit}
                      | sort @timestamp desc
                      `,
                    startTime: new Date().getTime() - 86400000 * this.range,
                    logGroupName: this.logGroupName,
                };
            default:
                console.log('Wrong query');
        }
    }

    async getQueryResult(queryId) {
        while (true) {
            const insightData = await cloudwatchlogs.getQueryResults({ queryId }).promise();
            if (insightData?.results.length > 0 && insightData?.status === 'Complete') {
                if (this.query === 'message') {
                    // get the latest record if lambda getStatus (index 0 because desc order)
                    if (new RegExp(/status/i).test(this.logGroupName)) {
                        return { ptr: insightData.results[0][2].value, status: 'done', error: null };
                    } else {
                        //get the first record
                        return { ptr: insightData.results[insightData.results.length - 1][2].value, status: 'done', error: null };
                    }
                } else if (this.query === 'requestId') {
                    // get log name
                    const logNameArr = this.logGroupName.split('/');
                    const logName = logNameArr[logNameArr.length - 1];

                    // remove ptr from result array
                    const result = insightData.results.map((record) => [record[0], record[1]]);

                    await fs.writeFile(`./server/CloudWatch/logs/${logName}.json`, JSON.stringify(result), (err) => console.log(err));

                    console.log('Complete');
                    // choose next lambda
                    const repeat = this.configureLogGroupNames(this.logGroupName);
                    console.log(repeat);
                    // stop loop
                    if (!repeat) {
                        this.setStatus('finish');
                        return { ptr: null, status: 'finish', error: null };
                    }
                    // set params, get cashed id
                    this.setParams({ id: this.cashedId, query: 'message' });
                    return { ptr: null, status: 'running', error: null };
                }
            } else if (insightData?.results.length === 0 && insightData?.status === 'Complete') {
                console.log('no records');
                return { ptr: null, status: 'done', error: 'Records not found' };
            } else {
                console.log(insightData);
            }
        }
    }

    async getLogRecord(ptr) {
        return await cloudwatchlogs.getLogRecord({ logRecordPointer: ptr }).promise();
    }

    setParams(params) {
        for (let [key, value] of Object.entries(params)) {
            this[key] = value;
        }
    }

    addToCash(id) {
        this.cashedId = id;
    }

    getFromCash() {
        return this.cashedId;
    }

    configureLogGroupNames(currentLambda) {
        const getLambdaIndex = this.logGroupNames[this.method].indexOf(currentLambda);
        if (getLambdaIndex === this.logGroupNames[this.method].length - 1) {
            return false;
        } else {
            this.logGroupName = this.logGroupNames[this.method][getLambdaIndex + 1];
            return true;
        }
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }
}

module.exports = CW;
