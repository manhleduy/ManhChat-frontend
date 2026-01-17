import { api } from "../axios";
import { useState } from "react";
export const MakeRequest= async(
    url:string, 
    type:"get"|"post"|"put"|"delete", 
    setError: (message:string)=>void, 
    setLoading:(loading: boolean)=>void,
    data?:any
)=>{
    try {
    setLoading(true);
    if(type==="get"){
        await api.get(url);
    }else if(type==="post"){
        await api.post(url, data);
    }else if(type==="put"){
        await api.put(url, data);
    }else if(type==="delete"){
        await api.delete(url, {data});
    }
    setError("")
    setLoading(false)
    
  } catch (e: any) {
    setLoading(false);
    setError(e.response?.data?.message || e.message || 'An error occurred',);
  }
}   
export const FetchData= async<T>(url:string, type:"get"|"post"|"put"|"delete", defaultInfo:T, body:any)=>{
    const [error, setError]= useState<string>("")
    const [loading, setLoading]= useState<boolean>(false);
    const [data, setData]= useState<T>(defaultInfo);
     try{
        setLoading(false);
        if(type==="get"){
            const response= await api.get(url);
            setData(response.data);
        }else if(type==="post"){
            const response= await api.post(url, body);
            setData(response.data);
        }else if(type==="put"){
            const response= await api.put(url, body);
            setData(response.data);
        }else if(type==="delete"){
            const response= await api.delete(url, body);
            setData(response.data);
        }else{
            setError("your request type are not allow to fetch data from database");
        } 
    }catch(e:any){
        console.log(e);    
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred')

    }finally{
        setLoading(false);
        setError("");
    }
    return {error, loading, data};
}
