import {ref, uploadBytes, getDownloadURL} from "firebase/storage"

import {v4 as uuid} from "uuid"
const MAX_SIZE= 10* 1024* 1024
/*const  uploadChatFile= async(file: File)=>{
    if(file.size>MAX_SIZE){
        throw new Error("file exceeds 10MB")

    }
    const fileId= uuid()
    const fileRef= ref(storage, `chat-files`);
    
    await uploadBytes(fileRef, file);

    const downloadURL= await getDownloadURL(fileRef);
    
}*/