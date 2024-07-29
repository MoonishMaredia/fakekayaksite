import axios from 'axios'
import _ from 'lodash'


export async function makeGPTRequests(userMessage, prevAIMessage, inputObjString) {

  const postInput = JSON.stringify({ userMessage, prevAIMessage, inputObjString })

  try {
    const data = await axios.post(process.env.REACT_APP_INFLATION_URL + "/makeGPTRequests", postInput)
    .then(res => res.data);
    return [data.completionResponse, data.codeResponse, data.userResponse]
  } catch (error) {
    console.error("Error making API call:", error);
    return {"Error": error}
  }

}