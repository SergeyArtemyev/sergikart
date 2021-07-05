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
    }

    async getQueryId(params) {
        return await cloudwatchlogs.startQuery(params).promise();
    }

    configureQuery() {
        switch (this.query) {
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
                    return insightData.results[1][2].value;
                } else if (this.query === 'requestId') {
                    await fs.writeFile('log.json', JSON.stringify(insightData.results), (err) => console.log(err));
                    this.setStatus('complete');
                    console.log('Complete');
                    break;
                }
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

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }
}

module.exports = CW;
