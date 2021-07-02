const axios = require('axios');

const url = 'https://predproc-test.gbsystems.pro/pay/genkey';
const data = `<?xml version="1.0"?>
    <root>
    <request type="genkey">
    <login>5439</login>
    <password>62ead7808c41cee35546305bb38e2a91</password>
    <pubkey>-----BEGIN RSA PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCp0NFIUKFJ2LOhUY/hltJosasw
    b8o/EUuChntW9/NGuo0+2pz8pRd0xueEX7LxQQP8VUgqX5Dxh5NuWMmBnQYg7Y6E
    MG/v5M50TDYukFQZ55IXrqL5p/qLnzdasrxyFZ/IDIw1beDr931Ih6IfAJNu4+w1
    FgOdcsliZK4mYb4bFwIDAQAB
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
