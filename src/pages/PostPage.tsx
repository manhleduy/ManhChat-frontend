import { selectUserPostList, selectFriendPostList } from "@/redux/slice/PostListSlice";
import { getAllFriendPost, getAllPost } from "@/lib/services/postService";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "@/redux/slice/userSlice";
import Post from "@/components/Post";
import AsideBar from "@/components/AsideBar";
const PostPage = () => {
    const dispatch= useAppDispatch()
    const navigate= useNavigate();
    const currentUser= useAppSelector(selectUserInfo).info;
    const currentPost= useAppSelector(selectFriendPostList);
    const [friendPosts, useFriendPosts]= useState(currentPost)
    useEffect(()=>{
        if(currentUser.id<0)navigate('/')
        dispatch(getAllFriendPost(currentUser.id));


    },[friendPosts, useFriendPosts]);
    console.log(currentPost);
  return (
        <div className="flex h-full w-full">
        
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <AsideBar/>
            <section className="flex flex-col w-full items-start px-6 md:px-16 lg:px-24 text-sm max-w-6xl mx-auto">
                
                <h1
                    className="text-3xl font-medium bg-gradient-to-r from-slate-800 to-slate-500 text-transparent bg-clip-text mt-4">
                    Explore what your friends do in lately
                </h1>
                <p className="text-slate-500 mt-4 max-w-2xl">
                    
                </p>
            
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
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