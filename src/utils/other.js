export function getLandingChatMessage() {

    const message = `Hello! I’m here to help you find the perfect flight for your trip. To get started, 
    could you please let me know if your trip is a round-trip or one-way?`
    
    return message
}


export function getLandingResultsChatMessage() {
    const message = `Hello! I’m here to help you finalize your booking. I can assist you in 3 ways:<br>
    1) Help update your flight request details (e.g. update my return date to Oct 1, 2024)
    2) Sort your flight results (e.g. sort results based on total travel time)
    3) Filter your flight resuls (e.g. only show non-stop flights)
    You can also ask me to perform a combination of these actions (e.g. update my return airport to JFK and only show non-stop flights).`
    
    return message
}

export function getLandingChatHTML() {
    const htmlMessage = `<p>Hello! I’m here to help you find the perfect flight for your trip. 
    To get started, could you please let me know if your trip is a round-trip or one-way?</p>`
    
    return htmlMessage
}


export function getLandingResultsChatHTML() {
    const htmlMessage = `<p>Hello! I’m here to help you finalize your booking. I can assist you in 3 ways:<br><br>
    1) Help update your flight request details (e.g. update my return date to Oct 1, 2024)<br><br>
    2) Sort your flight results (e.g. sort results based on total travel time)<br><br>
    3) Filter your flight resuls (e.g. only show non-stop flights)<br><br>
    
    You can also ask me to perform a combination of these actions (e.g. update my return airport to JFK and only show non-stop flights). 
    </p>`
    
    return htmlMessage
}