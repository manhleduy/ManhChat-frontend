import React, {useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import ManhChatImage from '../assets/ManhChat.png';
import { inviteSchema, type InviteSchema } from '@/lib/inputSchema';
import {zodResolver} from "@hookform/resolvers/zod"
import { inputFormConfig } from '@/lib/const';
import { ChevronLeft, XIcon } from 'lucide-react';
type FieldDef = {
    name: keyof InviteSchema;
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
};
  const InputField: React.FC<{ field: FieldDef }> = ({ field }) => {
    const { register, formState: { errors }} = useFormContext<InviteSchema>();
    const error = errors[field.name as keyof typeof errors] as any | undefined;

    // special-case validation for confirmPassword to compare with password


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


const InvitationForm = ({setOpenInviteForm}:any) => {
    const [inviteInfor, setInviteInfor]= useState<InviteSchema>();
    const methods = useForm<InviteSchema>({
        mode: 'onSubmit',
        resolver:zodResolver(inviteSchema),
        defaultValues: {
          to:"",
          content:"Hello i want to make friend with you ",
        },
    });
    const { handleSubmit, reset } = methods;
    const [showSuccess, setShowSuccess] = useState(false);
    

      const onSubmit = (data: InviteSchema) => {
        console.log(data);
        setShowSuccess(true);
        reset();
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      };
    
    

    const fields: FieldDef[] = [
        { name: 'to', id: 'to', label: inputFormConfig.to_label, placeholder: 'Who will received this' },
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

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4 text-green-800 font-medium text-center">
            send invitation successful
          </div>
        )}

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
        </div>

        
      </main>
    </div>
  )
}

export default InvitationForm