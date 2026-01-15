import { api } from "../axios";

export const likePost= async(postId: number)=>{
    try{
        await api.put(`/api/post/${postId}`);
    }catch(e:any){
        console.log(e);
    }
}
export const createPost= async(
    data:{ userId:number, content:string, file:any},
    setError: (message: string)=>void,
    setLoading: (load: boolean)=>void
)=>{
    try{
        setLoading(true)
        await api.post(`/api/post/create/${data.userId}`,data )
        setLoading(false);
    }catch(e:any){
        console.log(e);
        setError(e.response?.data || e.message || "An error occured")
    }
}
export const deletePost= async(data:number)=>{
    try{
        await api.delete(`/api/post/${data}`);
    }catch(e:any){
        console.log(e);

    }
}