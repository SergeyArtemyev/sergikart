const cardValidation = (request) => {
    const currentDate = new Date().getTime();
    const cardExpirationDate = new Date(`${request.expiration_year},${request.expiration_month}, 01`).getTime();

    return cardExpirationDate >= currentDate   
};

// implementation before getting customer from DB

const isCardValid = cardValidation(request);
if (!isCardValid) {
    await putCustomMetrics({ mn, obj: { code: 400084, pid: request.project, gid: 0, isi: true, am: '0' } });
    return responseMessage(401, 400084, 'Credit card is expired');
}
