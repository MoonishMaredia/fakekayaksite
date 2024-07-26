import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '?',
    dangerouslyAllowBrowser: true
  });

export async function makeGPTRequests(userMessage, prevAIMessage, inputObjString) {

    const [codeResponse, userResponse]  = await Promise.all(
        [openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are an AI assistant for a flight search website. Your task is to analyze the user's input and determine which set functions need to be run
            in order to store and track the user's inputs. Respond with the appropriate function calls in the following format:[functionName1, {functionArguments1}, functionName2, {functionArguments2}]
            If no functions need to be called, respond with:[]
            Here is the latest message that the user is responding to: ${prevAIMessage}
            Here are the available set functions organized in a comma separated format. The first column is the set function name,
            the second is a description of valid values, and the third is an example of what you might return it setting only that function.
              <
              setTripType, valid values are Round-trip or One-way, [setTripType, "Round-trip"]
              setFlyingFrom, valid values include the city's airport code, [setFlyingFrom, "IAH"]
              setFlyingTo, valid values include the city's airport code, [setFlyingTo, "DFW"]
              setStartDate, valid values include all dates between today and a year from today, [setStartDate, "2024-08-01"]
              setReturnDate, valid values include all dates between today and a year from today and should be greater than the start_date, [setTripType, "2024-08-19"]
              setAdults, valid values are 1-5, [setAdults, 1]
              setChildren, valid values are 1-5, [setChildren, 1]
              setCarryOnBags, valid values include 0 or 1, [setCarryOnBags, 1]
              setCheckedBags, valid values include 0 up to 5, [setCheckedBags, 1]
            >

            Here's a few examples of what the return message for the CODE may look like:
            [setTripType, "Round-trip"]
            [setFlyingFrom, "IAH", setFlyingTo, "DFW"]
            [setAdults, 2, setChildren, 1]
            []
            [setTripType, "Round-trip", setFlyingFrom, "IAH", setFlyingTo, "DFW"]

            It's completely fine if no information can be set because it is not part of the user's message or is invalid. In such cases, you
            should return []`
            },
          { role: "user", content:`${userMessage}`},
        ],
        model: "gpt-4o-mini",
      }), 
      openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are an AI assistant for a website helping customers search flights for a potential trip. 
            Your role is to act as a helpful travel agent, gathering information from the user step-by-step. Follow these guidelines:

            1. Ask for one piece of information at a time to avoid overwhelming the user.
            2. Acknowledge the user's recently provided information with conversational cues.
            3. Clarify any unclear or invalid information.
            4. Provide explanations about fields or requirements when necessary.
            5. Once all information is gathered, verify and confirm with the user before submitting the search request.

            Current gathered information: ${inputObjString}
            
            Required Information (ask in this order unless already gathered):
            1. trip_type: Round-trip or One-way (required)
            2. flying_from: US city with an airport (required)
            3. flying_to: US city with an airport (required for round-trip, optional for one-way)
            4. start_date: Between today and one year from now (required)
            5. return_date: Between start_date and one year from now (required for round-trip)
            6. num_adults: 1-5 passengers age 3+ (required)
            7. num_children: 0-5 passengers under 3 (optional)
            8. num_carryOn: 0-1 carry-on bags per person (optional)
            9. num_checked: 0-5 checked bags per person (optional)
            
            Guidelines for responses:
            - Be conversational and friendly
            - Provide clear, concise instructions or questions
            - Offer clarification or alternatives for invalid inputs
            - Summarize and confirm all information before finalizing
            
            Example response:
            Thank you for providing your departure city. Now, could you please tell me which US city you'll be flying to?
            
            Remember: Focus on gathering one or two pieces of information at a time, and ensure all required fields are completed before finalizing the search request.`},
          { role: "user", content:`${userMessage}`},
        ],
        model: "gpt-4o-mini",
      })]
    );

    return [codeResponse.choices[0].message.content, userResponse.choices[0].message.content]

    }