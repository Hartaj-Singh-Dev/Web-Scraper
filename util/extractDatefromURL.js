export default function extractDatefromURL(url){
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
    const match = url.match(dateRegex) 
    if(match){
        return match[3];
    }
    return null;
}