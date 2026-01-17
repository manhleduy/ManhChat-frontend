import {useState, useEffect} from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/reduxHook';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';

import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { ArrowLeftCircle, Newspaper } from 'lucide-react';
import Post from './Post';
import type { PostDefaultInfo } from '@/lib/const';
import { useFetch } from '@/hook/reacthook';



const UserPostList = ({setOpenPostList}:any) => {
    
    const currentUser = useAppSelector(selectUserInfo).info;
    const {data, error, loading}= useFetch<PostDefaultInfo[]>(`/api/post/${currentUser.id}`, "get",[]);
    const [post, setPost]= useState<PostDefaultInfo[]>(data);
    const [openPostForm, setOpenPostForm]= useState<boolean>(false);
    const navigate= useNavigate();
    useEffect(()=>{
        setPost(data);
    },[data])

    useEffect(()=>{
        if(currentUser.id<=0) navigate('/');
    },[])
    
  return (
    <div className='w-full h-full px-10 py-5'>
        <div className='flex gap-3'>
            <h1 className='text-green-500 text-lg flex'>
                <button
                className={`lg:hidden `}
                onClick={()=>{
                    setOpenPostList(false)
                    }}>
                        <ArrowLeftCircle height={30} width={30} fill='green'/>
                    </button>
                Your Post</h1>
            <Tooltip>
                <TooltipTrigger asChild>
                   <Newspaper height={40} width={40} fill='green'/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Post a news</p>
                </TooltipContent>
            </Tooltip>
        </div>
        <div className='flex w-full h-fit justify-center  gap-5 m-4  flex-wrap '>
            {
                post.map((item,index)=>(
                  <Post props={item} key={index}/>
                ))
                
            }
        </div>
        
    </div>
  )
}

export default UserPostList