exports.handler = async (event, context) => {
  console.log('Test function invoked successfully');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  const environmentInfo = {
    functionName: 'test',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    httpMethod: event.httpMethod,
    path: event.path,
    message: 'Test function is working correctly!'
  };

  console.log('Environment info:', JSON.stringify(environmentInfo, null, 2));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      ...environmentInfo
    })
  };
};