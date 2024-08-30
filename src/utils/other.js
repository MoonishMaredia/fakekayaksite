import {airportCodes} from '../busyairportcodes'

export function getLandingChatMessage() {

    const message = `Hello! I’m here to help you find the perfect flight for your trip. To get started, 
    could you please let me know if your trip is a round-trip or one-way? Or if you know what you want you can
    provide a more complete request all at once?`
    
    return message
}


export function getLandingResultsChatMessage() {
    const message = `Hello! I’m here to help you finalize your booking. I can assist you in 4 ways:<br>
    1) Help update your flight request details (e.g. update my return date to Oct 1, 2024)
    2) Filter your flight resuls (e.g. only show non-stop flights)
    3) Sort your flight results (e.g. sort results based on total travel time)
    4) Confirm or book a specific flight (e.g. book the 1st flight in the list, book the 9:35am American airlines flight)
    You can also ask me to perform a combination of these actions (e.g. update my return airport to JFK and only show non-stop flights).`
    
    return message
}

export function getLandingChatHTML() {
    const htmlMessage = `<p>Hello! I’m here to help you find the perfect flight for your trip.<br><br>
    To get started, could you please let me know if your trip is a round-trip or one-way?</p><br>
    Or if you know what you want you can provide a more complete request all at once?`
    
    return htmlMessage
}


export function getLandingResultsChatHTML() {
    const htmlMessage = `<p>Hello! I’m here to help you finalize your booking. I can assist you in 4 ways:<br><br>
    1) Help update your flight request details (e.g. update my return date to Oct 1, 2024)<br><br>
    2) Filter your flight results (e.g. only show non-stop flights)<br><br>
    3) Sort your flight results (e.g. sort results based on total travel time)<br><br>
    4) Confirm or book a specific flight (e.g. book the 1st flight in the list, book the 9:35am American airlines flight)<br><br>
    You can also ask me to perform a combination of these actions (e.g. update my return airport to JFK and only show non-stop flights). 
    </p>`
    
    return htmlMessage
}



export function verifyMinMaxType(field, arg) {
    const parsed = parseInt(arg);
    if (isNaN(parsed)) {
      return {"msg":400, "error":"there was an error processing your request"}
    } else if(field === "num_passengers" && (![1, 2, 3, 4, 5].includes(parsed))) {
      // setFieldErrors({ ...fieldErrors, [field]: "#ERROR: Provided value should be between 1 and 5"});
      return {"msg":400, "error": "Number of passengers should be between 1 and 5"}
    } else if(field === "num_carryOn" && (![0, 1].includes(parsed))) {
      return {"msg":400, "error": "Number of carry on bags should be 0 or 1"}
    } else if(field === "num_checked" && (![0, 1, 2, 3].includes(parsed))) {
      return {"msg":400, "error": "Number of carry on bags should be between 1 and 3"}
    } else {
      // setFieldErrors({...fieldErrors, [field]: ""})
      return {"msg":200, "arg":arg}
    }
  }

  export function verifyAirportCode(airportSource1, arg1, inputsFlyingFrom, inputsFlyingTo, airportSource2=null, arg2=null, multipleArgs=false) {
    if(multipleArgs) {
      if(arg1===arg2) {
        return {"msg":400, "error":"Cannot process rest of request. Origin and destination airport cannot be the same."}
      } else if(!airportCodes.hasOwnProperty(arg1) || !airportCodes.hasOwnProperty(arg2)) {
        return {"msg":400, "error":"Cannot process rest of request. Provided airport(s) are not valid. Identify valid airports using inputs on screen"}
      } else {
        return {"msg":200}
      } 
    } else if(airportSource1==="setFlyingFrom") {
      if(arg1===inputsFlyingFrom) {
        return {"msg":400, "error":"Cannot process rest of request. Origin and destination airport cannot be the same"}
      } else if(!airportCodes.hasOwnProperty(arg1)) {
        return {"msg":400, "error":"Cannot process rest of request. Provided airport is not valid. Identify valid airports using inputs on screen"}
      } else {
        return {"msg":200, "arg":arg1}
      }
    } else if(airportSource1==="setFlyingTo") {
      if(arg1===inputsFlyingTo) {
        return {"msg":400, "error":"Cannot process rest of request. Origin and destination airport cannot be the same"}
      } else if(!airportCodes.hasOwnProperty(arg1)) {
        return {"msg":400, "error":"Cannot process rest of request. Provided airport is not valid. Identify valid airports using inputs on screen"}
      } else {
        return {"msg":200, "arg":arg1}
      }
    }
  }

  export function verifyDate(dateType, arg, inputsStartDate) {

    const [year, month, day] = arg.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day+1));
    const todayDate = new Date()
    if(dateType==='start_date') {
      if(utcDate < todayDate) {
        return {"msg":400, "error":"Invalid date. Start date is earlier than current date"}
      } else {
        return {"msg":200}
      }
    } else if(dateType==="return_date") {
        if(inputsStartDate & new Date(utcDate.toISOString()) < inputsStartDate)  {
          return {"msg":400, "error":"Invalid date. Start date is earlier than current date"}
      } else {
        return {"msg":200}
      }
    }
  }
