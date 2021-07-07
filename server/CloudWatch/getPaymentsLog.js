const CW = require('./CW');

const getLogsData = async (inputData) => {
    const CWInstance = new CW(inputData);
    // save id, because it will be replaced
    CWInstance.addToCash(inputData.id);

    while (true) {
        let params = CWInstance.configureQuery();

        const { queryId } = await CWInstance.getQueryId(params);
        console.log(queryId);
        // ptr is needed to get log of a single record
        const { ptr, status, error } = await CWInstance.getQueryResult(queryId);
        console.log(status);

        if (status === 'done' && error === null) {
            if (CWInstance.getStatus() !== 'finish') {
                const data = await CWInstance.getLogRecord(ptr);
                console.log(data);
                // set params
                CWInstance.setParams({ id: data.logRecord['@requestId'], query: 'requestId' });
                console.log(params);
            } else {
                return {};
            }
        } else if (status === 'running') {
            console.log('running');
        } else {
            console.log(error);
            return error;
        }
    }
};

// getLogsData({
//     logGroupName: '/aws/lambda/psp-dev-ecapzProcessAPayment',
//     range: 1,
//     id: '27315004',
//     limit: 20,
//     query: 'message',
//     method: 'payment',
// })
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));
getLogsData({
    logGroupName: '/aws/lambda/psp-dev-ecapzPayout',
    range: 3,
    id: '9249198',
    limit: 20,
    query: 'message',
    method: 'payout',
})
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

module.exports = getLogsData;
