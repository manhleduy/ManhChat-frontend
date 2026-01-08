import type { PostDefaultInfo } from "@/lib/const"
import { likePost } from "@/lib/services/postService";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

const Post = ({props}: {props: PostDefaultInfo}) => {
    const {postId, userId, content, name, createdAt, profilePic, likeNum}= props;
    const handleLike=async()=>{
        try{
            
            await likePost(postId);
            
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
    <div className="p-4 bg-white border-2 border-green-200 hover:border-green-400 hover:-translate-y-1 transition duration-300 rounded-lg shadow-lg shadow-green-100/50 max-w-80">
            <img className="rounded-md max-h-40 w-full object-cover" src="https://images.unsplash.com/photo-1560264418-c4445382edbc?q=80&w=400" alt="officeImage" />
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
        </div>
  )
}

export default Post