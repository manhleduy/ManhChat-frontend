import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "@/redux/slice/userSlice";
import Post from "@/components/Post";
import AsideBar from "@/components/AsideBar";
import { Pen } from "lucide-react";
import CreatePostForm from "@/components/CreatePostForm";
import type { PostDefaultInfo } from "@/lib/const";
import { useFetch } from "@/hook/reacthook";
const PostPage = () => {
    const navigate= useNavigate();
    const currentUser= useAppSelector(selectUserInfo).info;
    const [friendPosts, setFriendPosts]= useState<PostDefaultInfo[]>([])
    const [openCreateForm, setOpenCreateForm]= useState(false);
    const {error, loading, data}= useFetch<PostDefaultInfo[]>(`/api/post/friends/${currentUser.id}`, "get",[]);
    
    useEffect(()=>{
        setFriendPosts(data);
    },[data])
    //
    useEffect(()=>{
        if(currentUser.id<=0) navigate('/');
    },[])
    

  return (
        <div className="flex h-full w-full">
            {openCreateForm? <CreatePostForm setOpenCreateForm={setOpenCreateForm}/> : null}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <AsideBar/>
            <section className="flex flex-col w-full flex-wrap items-start px-6 md:px-16 lg:px-24 text-sm max-w-6xl mx-auto">
                
                <h1
                    className="text-3xl font-medium bg-gradient-to-r from-green-800 to-green-500 text-transparent bg-clip-text mt-4">
                    Explore what your friends do in lately
                </h1>
                <h2
                    className="text-3xl font-medium bg-gradient-to-r from-green-800 to-green-500 text-transparent bg-clip-text mt-4">
                    Post a post to friend 
                    <button
                    onClick={()=>setOpenCreateForm(true)}
                    className="bg-white border-3 border-green-500 m-2 rounded-full p-2">
                        <Pen height={20} width={20} fill="green"/>
                    </button>
                </h2>
                <p className="text-green-600 mt-4 max-w-2xl">
                    
                </p>
            
                <div className="grid grid-cols-1  gap-6 mt-10 w-full">
                    {
                        friendPosts.map((item, index)=>(
                            <Post props={item} key={index}/>
                            
                        ))
                    }
                </div>
            </section>
        </div>
    );
}

export default PostPage