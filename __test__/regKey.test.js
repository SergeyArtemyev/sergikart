const axios = require('axios');
const regKey = require('../tasks/regkey');

jest.mock('axios');

test('should return 0', () => {
    const answer = 0;
    const response = { data: answer };

    axios.post.mockResolvedValue(response);

    return regKey().then((data) => expect(data).toEqual(answer));
});
