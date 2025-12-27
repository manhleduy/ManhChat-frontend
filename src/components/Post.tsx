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
  return (
    <div className="p-4 bg-white border border-gray-200 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10 max-w-80">
            <img className="rounded-md max-h-40 w-full object-cover" src="https://images.unsplash.com/photo-1560264418-c4445382edbc?q=80&w=400" alt="officeImage" />
            <p className="text-gray-900 text-xl font-semibold ml-2 mt-4">
                {name}
            </p>
            <button 
            onClick={()=>{
                handleLike()
            }}
            className="flex justify-center items-center ">
                <Heart height={15} width={15} fill="red"></Heart>
                {likeNum}
            </button>
            <p className="text-zinc-400 text-sm/6 mt-2 ml-2 mb-2">
                {content}
            </p>
        </div>
  )
}

export default Post