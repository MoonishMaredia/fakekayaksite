import axios from 'axios'
import _ from 'lodash'


export async function makeGPTRequests(userMessage, prevAIMessage, inputObjString) {

  const postInput = { 
    userMessage, 
    prevAIMessage, 
    inputObjString: JSON.stringify(inputObjString)
  };

  try {
    const data = await axios.post(process.env.REACT_APP_BACKEND_URL + "/makeGPTRequests", postInput)
    .then(res => res.data);
    return [data.completionResponse, data.codeResponse, data.userResponse]
  } catch (error) {
    console.error("Error making API call:", error);
    return {"Error": error}
  }

}

export async function makeTriageRequests(userMessage, prevAIMessage) {

  const postInput = { 
    userMessage, 
    prevAIMessage, 
  };

  try {
    const data = await axios.post(process.env.REACT_APP_BACKEND_URL + "/makeTriageRequest", postInput)
    .then(res => res.data);
    return data.triageResponse
  } catch (error) {
    console.error("Error making API call:", error);
    return {"Error": error}
  }

}


export async function getFlightResults(originCode, destinationCode, tripType, startDate, returnDate) {

  const postInput = { 
    'originCode':originCode, 
    'destinationCode':destinationCode, 
    'tripType':tripType,
    'origDate':startDate,
    'returnDate':returnDate
  };

  try {
    const data = await axios.post(process.env.REACT_APP_BACKEND_URL + "/getFlightResults", postInput)
    .then(res => res.data);
    return data
  } catch (error) {
    console.error("Error making API call:", error);
    return {"Error": error}
  }

}


export async function getFlightScalars(dateStr, numFlights) {
  
  const postInput = { 
    'date':dateStr, 
    'numFlights':numFlights
  };

  try {
    const data = await axios.post(process.env.REACT_APP_BACKEND_URL + "/getFlightScalars", postInput)
    .then(res => res.data);
    return data
  } catch (error) {
    console.error("Error making API call:", error);
    return {"Error": error}
  }
}
