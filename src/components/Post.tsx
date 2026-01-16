import type { PostDefaultInfo } from "@/lib/const"
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmButton from "./Confirmbutton";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/redux/reduxHook";
import { selectUserInfo } from "@/redux/slice/userSlice";
import { MakeRequest } from "@/lib/services/services";
const Post = ({props}: {props: PostDefaultInfo}) => {
    const {postId, userId, content, name, createdAt, profilePic, likeNum, image}= props;
    const [openConfirm, setOpenConfirm]= useState(false);
    const [error, setError]= useState<string>("")
    const [loading, setLoading]= useState<boolean>(false);
    const currentUser= useAppSelector(selectUserInfo).info;
    //LIKE POST
    const handleLike=async()=>{
        try{
            await MakeRequest(`/api/post/${postId}`, "put",setError, setLoading)            
        }catch(e:any){
            console.log(e);
            toast.error(e.message);
        }
    }
    //DELETE POST
    const handleDeletePost= async()=>{
        try{
            await MakeRequest(`/api/post/${postId}`,"delete", setError, setLoading)
        }catch(e:any){
            console.log(e);
            toast.error(e.message);
        }
    }
    const defaultConfig = {
        primary_color: "#10b981",
        surface_color: "#f0fdf4",
        text_color: "#1f2937",
        background_color: "#ffffff"
    };

  return (
    <div className="p-4 bg-white border-2 border-green-200 hover:border-green-400 hover:-translate-y-1 transition duration-300 rounded-lg shadow-lg shadow-green-100/50 w-full min-w-80">
            {image?<img className="rounded-md max-h-40 w-full object-cover" src={image} alt="picture"/>:null}
            <p className="text-gray-900 text-xl font-semibold ml-2 mt-4" style={{ color: defaultConfig.text_color }}>
                {name}
            </p>
            <button 
            onClick={()=>{
                handleLike()
            }}
            className="flex justify-center items-center hover:scale-110 transition-transform">
                <Heart height={15} width={15} fill="red" className="mr-1"></Heart>
                <span className="text-sm font-medium" style={{ color: defaultConfig.primary_color }}>{likeNum}</span>
            </button>
            <p className="text-zinc-600 text-sm/6 mt-2 ml-2 mb-2" style={{ color: defaultConfig.text_color }}>
                {content}
            </p>
            {
            userId===currentUser.id&&
            <ConfirmButton
                acceptFunc={handleDeletePost}
                cancelFunc={()=>setOpenConfirm(false)}
                openConfirm={openConfirm}
                setOpenConfirm={setOpenConfirm}
                size={6}
                icon={<Trash height={20} width={10} fill="red"/>}
            />
            }
        </div>
  )
}

export default Post