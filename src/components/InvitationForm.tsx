import React, {useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { friendInviteSchema, type FriendInviteSchema } from '@/lib/inputSchema';
import {zodResolver} from "@hookform/resolvers/zod"
import { inputFormConfig } from '@/lib/const';
import { XIcon, SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendInvitation } from '@/lib/services/invitationService';
import UserList from './UserList';
import { findUsers } from '@/lib/services/userService';
import type { UserDefaultInfo } from '@/lib/const';
import { useFieldArray } from 'react-hook-form';
import { useAppSelector } from '@/redux/reduxHook';
import { selectUserInfo } from '@/redux/userSlice';
// Define the User interface

type FieldDef = {
    name: keyof FriendInviteSchema;
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
};
  const InputField: React.FC<{ field: FieldDef }> = ({ field }) => {
    const { register, formState: { errors }} = useFormContext<FriendInviteSchema>();
    const error = errors[field.name as keyof typeof errors] as any | undefined;
    

    return (
      <div className="mb-6">
        <label htmlFor={field.id} className="block text-sm font-semibold text-green-800 mb-2">
          {field.label}
        </label>
        <input
          id={field.id}
          type={field.type || 'text'}
          placeholder={field.placeholder}
          {...register(field.name)}
          className={`w-full px-4 py-3 border-2 rounded-lg text-base font-normal bg-white text-gray-900 placeholder-gray-400 outline-none transition-all
          }`}
        />
        {error && (
          <div className="text-red-600 text-sm mt-1.5 font-medium">
            {error.message}
          </div>
        )}
      </div>
    );
  };
const defaultInfo={
  name:"",
  email:"",
  phonenumber:"",
  content:"Hello i want to make friend with you"
}

const InvitationForm = ({setOpenInviteForm}:any) => {
    const currentUser= useAppSelector(selectUserInfo).info;
    const [selectedUser,setSelectedUser] =useState<UserDefaultInfo>()
    const [foundUsers, setFoundUsers]= useState<UserDefaultInfo[]>([]);
    const [error, setError]= useState<string>("");
    const [loading, setLoading]= useState<boolean>(false);
    console.log(selectedUser)
    const methods = useForm<FriendInviteSchema>({
        mode: 'onSubmit',
        resolver:zodResolver(friendInviteSchema),
        defaultValues: defaultInfo,
        
    });
    const { handleSubmit, reset, getValues,setValue  } = methods;
    useEffect(()=>{
      setValue("name", selectedUser?.name||"");
      setValue("email", selectedUser?.email||"");
      setValue("phonenumber", selectedUser?.phonenumber||"");
      setFoundUsers([]);
    },[selectedUser, setSelectedUser])
    const onFind=async()=>{
      try{
        const {name, phonenumber, email}= getValues();
        const result= await findUsers({name, phonenumber, email},setError, setLoading)
        setFoundUsers(result);
      }catch(e:any){
        console.log(e);
        toast.error(e.message);
      }
    }
    const onSubmit =async (data: FriendInviteSchema) => {
      try{
        const {name, email, phonenumber, content}= getValues()
        await sendInvitation({name:name,email:email, phonenumber:phonenumber, content:content, senderId:currentUser.id  }, setError, setLoading);
       reset();
      }catch(e:any){
        console.log(e);
        toast.error(e.message); 
      }
      
    };
    
    

    const fields: FieldDef[] = [
        { name: 'name', id: 'name', label: inputFormConfig.name_label, placeholder: 'Who will received this' },
        { name: 'email', id: 'email', label: inputFormConfig.email_label, placeholder: 'email' },
        { name: 'phonenumber', id: 'phonenumber', label: inputFormConfig.phone_number_label, placeholder: 'phone number' },
        { name: 'content', id: 'email', label: inputFormConfig.content_label, type: 'string', placeholder: 'What you want to say?' },
    ];
    
  return (
    <div className="fixed z-100 bg-[rgba(0,0,0,0.22)] h-full w-screen flex  px-5 py-10 flex-col">

      <main className=" bg-white p-4 rounded-3xl  w-full border-3 max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-10">
          
          <h1 className="flex justify-between text-4xl font-semibold text-gray-900 mb-2">
            
            Send an invitation
            <button onClick={()=>{setOpenInviteForm(false)}}>
                <XIcon height={40} width={20} color={'red'}/>
            </button>
          </h1>
        </div>

        {/* Sign Up Form - uses FormProvider to share methods with InputField */}
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 mb-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {fields.map(f => (
                <InputField key={String(f.name)} field={f} />
              ))}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-green-500 text-white rounded-lg text-base font-semibold cursor-pointer border-none transition-all hover:bg-green-600 hover:-translate-y-px hover:shadow-lg active:translate-y-0 disabled:bg-green-300 disabled:cursor-not-allowed disabled:shadow-none"
              >
                send invitation
              </button>
            </form>
          </FormProvider>
          <button 
          onClick={()=>{onFind()}}
          className='bg-green-500 w-full py-3.5 my-3 text-white rounded-lg text-base font-semibold flex justify-center items-center hover:bg-green-600'>
            <SearchIcon height={20} width={20}/>
            find your friend
          </button>
        </div>
        <UserList onUserSelect={setSelectedUser} userList= {foundUsers}/>

        
      </main>
    </div>
  )
}

export default InvitationForm