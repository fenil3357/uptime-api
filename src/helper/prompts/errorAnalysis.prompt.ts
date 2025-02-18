const generateErrorAnalysisPrompt = (errorMessage: string, errorJson?: object) => {
  return `
  I am providing an error occurred in a service. Please provide a concise and detailed analysis.
  Error Message: ${errorMessage}.
  ${errorJson ? `Error JSON ${JSON.stringify(errorJson, null, 2)}` : ''}.
  Please analyze the error and provide a structured response in plain text with the following details:
  1) Error Summary
  2) Root Cause Analysis
  3) Resolution Steps
  4) Preventive Measures
  Please provide analysis in just simple string format, NOT in markdown.
  `
}

export default generateErrorAnalysisPrompt;