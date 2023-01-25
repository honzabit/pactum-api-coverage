# pactum-api-coverage

![Platform](https://img.shields.io/node/v/pactum)

API coverage reporter for [Pactum](https://www.npmjs.com/package/pactum) tests. Accepts Swagger/OAS spec data in JSON format.

## Installation

```shell
npm install --save-dev pactum pactum-api-coverage
```

## Usage

```javascript
const pactum = require('pactum');
const psc = require('pactum-api-coverage');
const reporter = pactum.reporter;

// global before block
before(() => {
  psc.specData = require("./specs/v1/oas.json");
  reporter.add(psc);
});

// global after block
after(() => {
  return reporter.end();
});
```

## Reporter Options

```javascript
const psc = require('pactum-api-coverage');

// name of the report file - defaults to "api-cov-report.json"
psc.file = 'report-name.json';

// folder path for the report file - defaults to "./reports"
psc.path = './reports-path';

// Load a local JSON spec file (or a remote one)
psc.specData = require("./specs/v1/oas.json");

// Ignore specific response codes
psc.ignoreResponseCodes = [ 400, 500]
```

### Report Json Output (example)
```javascript
{
  "basePath": "/v1",
  "coverage": 0.5,
  "coveredApiCount": 4,
  "missedApiCount": 4,
  "totalApiCount": 8,
  "coveredApiList": [
    "200|get|/v1/health",
    "200|get|/v1/getallninjas",
    "200|get|/v1/getninjas/{rank}",
    "200|get|/v1/getninja/{rank}/{name}"
  ],
  "missedApiList": [
    "200|post|/v1/health",
    "200|get|/v1/getninjas/{clan}/{rank}",
    "400|get|/v1/getninjas/{clan}/{rank}",
    "200|get|/v1/getninja/{name}"
  ]
}
```

## Notes

Read more about Pactum [here](https://www.npmjs.com/package/pactum).


Copied from [pactum-swagger-coverage](https://github.com/pactumjs/pactum-swagger-coverage) and altered.
