const fs = require('fs');
const path = require('path');

async function test() {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 2000);
    });
}

async function test1() {
    let a = await test();
    if (a) {
        console.log('work');
    } else {
        console.log('error');
    }
}

test1();
