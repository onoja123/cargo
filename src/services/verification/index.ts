import axios from "axios"

export const fetchDataDOJAH = async(url: string, method:string, data:string)=>{
    const option={
        url:url,
        data,
        method,
        header: {
            "Authorization": process.env.DOJAH_API_KEY|| "",
            "AppId": process.env.DOJAH_APP_ID || "",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }
    const request = await axios(option)
    return request
}


/**
 * @param {string} license the Driver License
 */
 export const verifyDriverLicense = async ( license:string )=>{
    try {
        const data = license 

        const verify = await fetchDataDOJAH(`${process.env.DOJAH_API_BASE_URL}/api/v1/kyc/dl?license_number=${data}`, "GET", "")
        return verify
    } catch (error) {
        return error
    }
}

/**
 * @param {string} nin the Driver NIN
 */
 export const verifyNIN = async ( nin:string )=>{
    try {
        const data = nin 

        const verify = await fetchDataDOJAH(`${process.env.DOJAH_API_BASE_URL}/api/v1/kyc/dl?lnin=${data}`, "GET", "")
        return verify
    } catch (error) {
        return error
    }
}


// Redissss bugs i can till log in 