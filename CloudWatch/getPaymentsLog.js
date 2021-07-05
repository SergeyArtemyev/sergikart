const AWS = require('aws-sdk');
const CW = require('./CW');

const getLogsData = async (inputData) => {
    const CWInstance = new CW(inputData);
    let ptr;

    //TO DO
    // implement loop to repeat query

    while (true) {
        let params = CWInstance.configureQuery();

        const { queryId } = await CWInstance.getQueryId(params);
        console.log(queryId);

        ptr = await CWInstance.getQueryResult(queryId);

        if (CWInstance.getStatus() !== 'complete') {
            const data = await CWInstance.getLogRecord(ptr);
            console.log(data);

            CWInstance.setParams({ id: data.logRecord['@requestId'], query: 'requestId' });
            console.log(params);
        } else {
            return {};
        }
    }
};

getLogsData({
    logGroupName: '/aws/lambda/psp-dev-ecapzProcessAPayment',
    range: 1,
    id: '27057050',
    limit: 10,
    query: 'message',
})
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
