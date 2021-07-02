const axios = require('axios');

const url = 'https://predproc-test.gbsystems.pro/pay/genkey';
const data = `<?xml version="1.0"?>
    <root>
    <request type="genkey">
    <login>логин</login>
    <password>пароль</password>
    <pubkey>-----BEGIN RSA PUBLIC KEY-----
    ключ
    -----END RSA PUBLIC KEY-----
    </pubkey>
    </request>
    </root>`;

const regKey = async (url, xmlData) => {
    try {
        const response = await axios.post(url, xmlData, { headers: { 'Content-Type': 'text/plain' } });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

module.exports = regKey;
