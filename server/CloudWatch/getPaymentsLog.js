const CW = require('./CW');

const getLogsData = async (inputData) => {
    const CWInstance = new CW(inputData);
    CWInstance.addToCash(inputData.id);

    while (true) {
        let params = CWInstance.configureQuery();

        const { queryId } = await CWInstance.getQueryId(params);
        console.log(queryId);

        const { ptr, status, error } = await CWInstance.getQueryResult(queryId);
        console.log(status);

        if (status === 'done' && error === null) {
            // maybe set status: "compete" in return statement
            if (CWInstance.getStatus() !== 'finish') {
                const data = await CWInstance.getLogRecord(ptr);
                console.log(data);

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

getLogsData({
    logGroupName: '/aws/lambda/psp-dev-ecapzProcessAPayment',
    range: 1,
    id: '27223560',
    limit: 10,
    query: 'message',
    method: 'payment',
})
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
// getLogsData({
//     logGroupName: '/aws/lambda/psp-dev-ecapzPayout',
//     range: 1,
//     id: '9252496',
//     limit: 10,
//     query: 'message',
//     method: 'payout',
// })
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));

module.exports = getLogsData;
