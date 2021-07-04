const AWS = require('aws-sdk');
const CW = require('./CW');
const cloudwatchlogs = new AWS.CloudWatchLogs();

const getLogsData = async (inputData) => {
    const CWInstance = new CW(inputData);
    let ptr;

    //TO DO
    // implement cycle to repeat query

    const params = CWInstance.configureQuery();

    const { queryId } = await CWInstance.getQueryId(params);

    ptr = await CWInstance.getQueryResult(queryId);
    console.log(ptr);
    // map through with ptrs
    const data = await cloudwatchlogs.getLogRecord({ logRecordPointer: ptr }).promise();
    console.log(data.logRecord['@requestId']);

    return {};
};

getLogsData({
    logGroupName: '/aws/lambda/psp-dev-ecapzProcessAPayment',
    range: 1,
    id: '27057050',
    limit: 10,
    query: 'message',
}).then((data) => console.log(data));
