import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {postSchema, type PostSchema} from '@/lib/inputSchema';
import ManhChatImage from '../assets/ManhChat.png';
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/redux/reduxHook';
import { createGroup } from '@/lib/services/groupService';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { createPost } from '@/lib/services/postService';
import { motion } from "framer-motion"


const CreatePostForm= ({setOpenCreateForm}:any) => {
  const curretUser= useAppSelector(selectUserInfo).info
  const [error, setError]= useState<string>("");
  const [loading, setLoading]= useState<boolean>(false);
  const methods = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    mode: 'onSubmit',
    defaultValues: { file:undefined ,content: ''},
  });

  const { handleSubmit } = methods;

  const onSubmit =async (data: PostSchema) => {  
    try{
      const file= data.file;
      if(!file) return;
      const reader= new FileReader()
      reader.readAsDataURL(file[0]);
      reader.onload= async()=>{
        const base64Image= reader.result;
        await createPost({userId: curretUser.id, content: data.content, file: base64Image}, setError, setLoading)
      }
    }catch(e:any){
      console.log(e);
      toast.error(e.message);
    }finally{
      toast.success("Image uploaded")
    }
  };

  type FieldDef = { name: keyof PostSchema; id: string; label: string; type?: string; placeholder?: string; isTextarea?: boolean };

  const InputField: React.FC<{ field: FieldDef }> = ({ field }) => {
    const { register, formState: { errors } } = useFormContext<PostSchema>();
    const error = errors[field.name as keyof typeof errors] as any | undefined;

    return (

      <div className="mb-6">
        
        <label htmlFor={field.id} className="block text-sm font-semibold text-green-800 mb-2">
          {field.label}
        </label>
        {field.isTextarea ? (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            {...register(field.name as any)}
            className={`w-full px-4 py-3 border-2 rounded-lg text-base font-normal bg-white text-gray-900 placeholder-gray-400 outline-none transition-all resize-none ${
              error ? 'border-red-500' : 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-100'
            }`}
            rows={4}
          />
        ) : (
          <input
            id={field.id}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            {...register(field.name as any)}
            className={`w-full px-4 py-3 border-2 rounded-lg text-base font-normal bg-white text-gray-900 placeholder-gray-400 outline-none transition-all ${
              error ? 'border-red-500' : 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-100'
            }`}
          />
        )}
        {error && (
          <div className="text-red-600 text-sm mt-1.5 font-medium">
            {String(error.message)}
          </div>
        )}
      </div>
    );
  };

  const fields: FieldDef[] = [
    { name: 'file', id: 'file', label: 'Image', placeholder: 'post your image', type:'file' },
    { name: 'content', id: 'content', label: 'content', placeholder: 'said something', isTextarea: true },
  ];

  return (
    <motion.div initial={{opacity:0, x:100}} animate={{opacity:1, x:0}} transition={{duration:0.5}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">
        <button className='relative left-5 top-5'
                onClick={()=>setOpenCreateForm(false)}>
                    <XIcon height={30} width={30}/>
                </button>
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4">
                
              <img
                src={ManhChatImage}
                alt="ManhChat Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              New Post
            </h1>
            <p className="text-sm text-gray-500">Fill in the details to share with your friends</p>
          </div>

         
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {fields.map(f => (
                <InputField key={String(f.name)} field={f} />
              ))}
              <motion.button
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                type="submit"
                className="w-full py-3.5 bg-green-500 text-white rounded-lg text-base font-semibold cursor-pointer border-none transition-all hover:bg-green-600 hover:-translate-y-px hover:shadow-lg active:translate-y-0 disabled:bg-green-300 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Create Post
              </motion.button>
            </form>
          </FormProvider>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePostForm