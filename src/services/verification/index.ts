import axios from "axios"

export const fetchDataDOJAH = async(url: string, method:string, data:string)=>{
    const option={
        url:url,
        data,
        method,
        header: {
            "Authorization": process.env.DOJAH_API_KEY|| "",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }
    const request = await axios(option)
    return request
}

const imageToString =  (src : string, callback:any)=>{
    const image = new Image()
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        if(context){
            context.drawImage(image, 0, 0);
        }
        var dataURL = canvas.toDataURL('image/jpeg');
        callback(dataURL);
     };
     image.src = src
}

/**
 * @param {string} imagepath image path this is to change the image to data:image/jpeg;base64 before posting 
 * @param {string} nin the user NIN code 
 */
export const verifyNIN = async (imagepath:string, nin:string)=>{
    try {
        const newImage = imageToString(imagepath, (dataNew :any) =>{
            return dataNew
        })
        const data = JSON.stringify({
            "selfie_image" : newImage,
            "nin" : nin
        })
        const verify = await fetchDataDOJAH(`${process.env.DOJAH_API_URL}/api/v1/kyc/nin/verify`, "POST", data)
    } catch (error) {
        return error
    }
}

/**
 * @param {string} license the user Driver License
 */
 export const verifyDriverLicense = async ( license:string )=>{
    try {
        var data = JSON.stringify({
            "license_number":license 
        })
        const verify = await fetchDataDOJAH(`${process.env.DOJAH_API_URL}/api/v1/kyc/dl`, "POST", data)
        return verify
    } catch (error) {
        return error
    }
}

/// need the ogin to test 
// and need to created endpoint for webhooks