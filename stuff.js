let logGroupName = '/aws/lambda/psp-dev-ecapzGetPaymenttatus';
console.log(new RegExp(/status/i).test(logGroupName));
