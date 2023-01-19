const config = require('../config');

/**
 * Fuction to all get api path's from swagger file
 * @param {Object} specInfo
 * @returns {Array} Array of API paths
 */
function getApiOperations(specInfo) {
	const verbs = [ 'get', 'post', 'put', 'delete', 'options', 'head', 'patch', 'trace']
  const apiPaths = Object.keys(specInfo.paths);
  const apiOperations = [];
  apiPaths.forEach((apiPath) => {
	apiOperations.push(...Object.keys(specInfo.paths[apiPath]).filter(o => verbs.includes(o)).map(o => `${o}|${config.basePath}${apiPath}`))
  });
  return apiOperations;
}

/**
 * Function to get API coverage stats
 * @param {Array} testsCoveredApis
 * @returns {object} API coverage stats
 */
async function getAPICoverage(testsCoveredApis) {
  const specInfo = config.specData;
  const apiPaths = getApiOperations(specInfo);
  const apiCovList = apiPaths.map(apiPath =>
    !!testsCoveredApis.find(({ path, method }) => {
      return !!regExMatchOfPath(apiPath.toLowerCase(), `${method}|${path}`.toLowerCase());
    }));

  return {
    basePath: config.basePath ?? specInfo.basePath,
    coverage: apiCovList.reduce((total, result, index, results) => result ? total + 1 / results.length : total, 0),
    coveredApiCount: apiPaths.filter((_, idx) => apiCovList[idx]).length,
    missedApiCount: apiPaths.filter((_, idx) => !apiCovList[idx]).length,
    totalApiCount: apiCovList.length,
    coveredApiList: apiPaths.filter((_, idx) => apiCovList[idx]),
    missedApiList: apiPaths.filter((_, idx) => !apiCovList[idx])
  }
}

/**
 * Function to RegEx match api paths
 * @param {String} apiPath
 * @param {String} rPath
 * @returns {Boolean} Match result
 */
function regExMatchOfPath(apiPath, rPath) {
  const regex = RegExp(apiPath.replace(/{[^\/]+}/ig,'.+').replace('\|', '\\|'))
  const extractedApiPath = rPath.match(regex);
  const extractedPathSepCount = (extractedApiPath ? extractedApiPath.input.match(/\//ig) : []).length;
  const apiPathSepCount = (apiPath.match(/\//ig) || []).length;
  return regex.test(rPath) && (extractedPathSepCount === apiPathSepCount);
}

module.exports = {
  getAPICoverage
}
