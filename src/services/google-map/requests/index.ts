import axios from "axios"

export const fetchData = async(url: string, method:string, data:string)=>{
    const option={
        url:url,
        data,
        method,
        header: {
            "Authorization": process.env.INFOBIP_API_KEY|| "",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }
    const request = await axios(option)
    return request
}


export const sendSms = async(phoneNuber: any, body:string)=>{
    var postData = JSON.stringify({
        "messages": [
            {
                "destination": [
                    {
                        "to": phoneNuber
                    }
                ],
                "from": process.env.SENDNERNAME || "",
                "text": body
            }
        ]
    });
    const send = fetchData(
        process.env.INFOBIP_URL || "",
        "POST",
        postData || ""
    )
}

