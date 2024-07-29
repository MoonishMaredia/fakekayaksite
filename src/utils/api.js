import axios from 'axios'
import _ from 'lodash'


export async function makeGPTRequests(userMessage, prevAIMessage, inputObjString) {

  // console.log("User Message: ", userMessage)
  // console.log("prevAIMessage: ", prevAIMessage)
  // console.log("inputObjString: ", inputObjString)
  const postInput = { 
    userMessage, 
    prevAIMessage, 
    inputObjString: JSON.stringify(inputObjString)
  };
  // console.log("PostInput:", postInput)

  try {
    const data = await axios.post(process.env.REACT_APP_BACKEND_URL + "/makeGPTRequests", postInput)
    .then(res => res.data);
    return [data.completionResponse, data.codeResponse, data.userResponse]
  } catch (error) {
    console.error("Error making API call:", error);
    return {"Error": error}
  }

}