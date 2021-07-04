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
    }

    setParams(params) {}

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
                return {};
            default:
                console.log('Wrong query');
        }
    }

    async getQueryResult(queryId) {
        while (true) {
            const insightData = await cloudwatchlogs.getQueryResults({ queryId }).promise();

            if (insightData?.results.length > 0 && insightData?.status === 'Complete') {
                console.log(insightData.results);
                if (this.query === 'message') {
                    return insightData.results[1][2].value;
                } else if (this.query === 'requestId') {
                    //TO DO
                    //add cycle to build full log
                }
            } else {
                console.log(insightData);
            }
        }
    }
}

module.exports = CW;
