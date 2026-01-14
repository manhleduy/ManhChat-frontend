import React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod"
import { inputFormConfig } from '@/lib/const';
import { XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {type GroupRequestSchema, groupRequestSchema } from '@/lib/inputSchema';
import type { GroupDefaultInfo } from '@/lib/const';
import { SearchIcon } from 'lucide-react';
import FoundList from './FoundList';
import { findGroup } from '@/lib/services/groupService';
import { sendGroupRequest } from '@/lib/services/invitationService';
import { useAppSelector } from '@/redux/reduxHook';
import { selectUserInfo } from '@/redux/slice/userSlice';
type FieldDef = {
    name: keyof GroupRequestSchema
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
};

  const InputField: React.FC<{ field: FieldDef }> = ({ field }) => {
    const { register, formState: { errors }} = useFormContext<GroupRequestSchema>();
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


const GroupRequestForm = ({setOpenInviteForm}:any) => {
    const currentUser= useAppSelector(selectUserInfo).info;
    const [selectedGroup,setSelectedGroup] =useState<GroupDefaultInfo>()
    const [foundGroups, setFoundGroups]= useState<GroupDefaultInfo[]>([]);
    const [error, setError]= useState<string>("");
    const [loading, setLoading]= useState<boolean>(false);
    const methods = useForm<GroupRequestSchema>({
        mode: 'onSubmit',
        resolver:zodResolver(groupRequestSchema),
        defaultValues: {
          groupName:"",
          adminName:"",
          groupId:0,
          content:"Hello i want to make friend with you ",
        },
    });
    
    
    const { handleSubmit, reset, setValue,getValues } = methods;
    useEffect(()=>{
        setValue("groupName", selectedGroup?.groupName||"");
        setValue("groupId", selectedGroup?.id||0);
        setValue("adminName", selectedGroup?.adminName||"");
        setFoundGroups([]);
    },[selectedGroup, setSelectedGroup])
    
    const onFind=async()=>{
        try{
        const {groupName, groupId, adminName}= getValues();
        const result= await findGroup({groupName:groupName, groupId: groupId, adminName:adminName},setError, setLoading)
        setFoundGroups(result);
      }catch(e:any){
        console.log(e);
        toast.error(e.message);
      }
    }
      const onSubmit =async (data: GroupRequestSchema) => {
        try{
        const {groupId, adminName, content}= getValues()
        await sendGroupRequest({groupId: groupId, adminName: adminName, content:content, userId: currentUser.id}, setError, setLoading);
       reset();
      }catch(e:any){
        console.log(e);
        toast.error(e.message); 
      }
      };
    

    const fields: FieldDef[] = [
        { name: 'groupName', id: 'groupname', label: inputFormConfig.group_name_label, placeholder: 'name of the group' },
        { name: 'adminName', id: 'groupname', label: inputFormConfig.admin_label, placeholder: 'Name of the admin label' },
        { name: 'groupId', id: 'groupname', label: inputFormConfig.group_id_label, placeholder: 'group id' },
        { name: 'content', id: 'email', label: inputFormConfig.content_label, type: 'string', placeholder: 'What you want to say?' },
    ];
    
  return (
    <div className="fixed z-100 bg-[rgba(0,0,0,0.22)] h-full w-screen flex items-center  px-5 py-10">
        
      <main className=" bg-white p-4 rounded-3xl  w-full border-3 max-w-md">
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
                {inputFormConfig.submit_button}
              </button>
            </form>
          </FormProvider>
            <button 
          onClick={()=>{onFind()}}
          className='bg-green-500 w-full py-3.5 my-3 text-white rounded-lg text-base font-semibold flex justify-center items-center hover:bg-green-600'>
            <SearchIcon height={20} width={20}/>
            find group
          </button>
        </div>
        <FoundList onSelect={setSelectedGroup} List= {foundGroups}/>
        
        
      </main>
    </div>
  )
}

export default GroupRequestForm