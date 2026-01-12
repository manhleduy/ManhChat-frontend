import React, {useState } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import ManhChatImage from '../assets/ManhChat.png';
import type { UserSignUpInfo } from '@/lib/const';
import { signUpSchema } from '@/lib/inputSchema';
import {zodResolver} from "@hookform/resolvers/zod"
import { inputFormConfig } from '@/lib/const';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { signUp } from '@/lib/services/userService';
import { verifyOTP } from '@/lib/services/userService';

const SignUpOTP=(WrappedComponent: any)=>{
  return function EnhancedComponent(props:any){
        const {setLoading, setError, error, loading, setOpenOTP, setOpenPasswordForm, newUserData}= props;
        const [input,setInput]= useState<string>("");
        
        const handleSubmit=async()=>{
            const OTP=parseInt(input)
            try{
                if(OTP<100000 || OTP>999999){
                    toast.error("your OTP is not valid retry now");
                    return;
                }

                await verifyOTP(OTP, setError, setLoading);
               
                toast.success("your OTP is valid")
                setOpenOTP(false);
                setOpenPasswordForm(true);

            }catch(e:any){
                console.log(e);
                toast.error(e.message);
            }
        }
        return(
            <WrappedComponent
            {...props}
            handleSubmit={handleSubmit}
            input={input}
            setInput={setInput}
            
            />
        )
    }
}
type FieldDef = {
    name: keyof FormData;
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
};
  const InputField: React.FC<{ field: FieldDef }> = ({ field }) => {
    const { register, formState: { errors }} = useFormContext<FormData>();
    const error = errors[field.name as keyof typeof errors] as any | undefined;
    return (
      <div className="mb-6" >
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
interface FormData{
    name:string;
    address:string;
    email:string;
    phonenumber:string;
    birthday:Date;
    password: string;
    confirmPassword: string;

};

const SignUpPage: React.FC = () => {
  const navigate= useNavigate();
  const [error, setError]= useState<string>("");
  const [loading, setLoading]= useState<boolean>(false);
  const [signUpData, setSignUpData]= useState<UserSignUpInfo>()
  const methods = useForm<FormData>({
    mode: 'onSubmit',
    resolver:zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phonenumber: '',
      address: '',
      birthday: new Date(),
    },
  });

  const { handleSubmit, reset, control } = methods;
  
  const onSubmit =async (data: FormData) => {
    
    try{

      await signUp({...data, profilePic: "", id:0}, setError, setLoading)
    }catch(e:any){
      console.log(e);
      toast.error(e.message);
      reset();

    }finally{
      setTimeout(()=>{
        toast.success("Sign up successfully");
        navigate("/login");
        reset();

      }, 5000);
    }
    
    
  };


  // Reusable input field that pulls methods from FormProvider via useFormContext



  const fields: FieldDef[] = [
    { name: 'name', id: 'name', label: inputFormConfig.name_label, placeholder: 'Enter your name' },
    { name: 'email', id: 'email', label: inputFormConfig.email_label, type: 'email', placeholder: 'Enter your email' },
    { name: 'password', id: 'password', label: inputFormConfig.password_label, type: 'password', placeholder: 'Enter your password' },
    { name: 'confirmPassword', id: 'confirmPassword', label: inputFormConfig.confirm_password_label, type: 'password', placeholder: 'Confirm your password' },
    { name: 'address', id: 'address', label: inputFormConfig.address_label, placeholder: 'Enter your address' },
    { name: 'phonenumber', id: 'phonenumber', label: inputFormConfig.phone_number_label, placeholder: 'Enter your phone number' }
    //{ name: 'birthday', id: 'birthday', label: inputFormConfig.birthday_label, type: 'date' },
  ];
  
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-5 py-10">
      <main className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-32 h-32 mx-auto mb-6">
            <img
              src={ManhChatImage}
              alt="ManhChat Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-base text-gray-500">Join us today!</p>
        </div>

        {/* Sign Up Form - uses FormProvider to share methods with InputField */}
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 mb-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {fields.map(f => (
                <InputField key={String(f.name)} field={f} />
              ))}
              {/* Birthday Field */}
              <Controller
                control={control}
                name="birthday"
                render={({ field: { onChange, onBlur, value } }) => (
                  <div className='mb-6'>
                  <label htmlFor="birthday" className="block text-sm font-semibold text-green-800 mb-2">
                    {inputFormConfig.birthday_label}
                  </label>
                  <ReactDatePicker
                    id="birthday"
                    selected={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="w-full px-4 py-3 border-2 rounded-lg text-base font-normal bg-white text-gray-900 placeholder-gray-400 outline-none transition-all"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Enter your birthday"
                  />
                  </div>
                )}
              />

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

        {/* Links */}
        <div className="text-center text-sm text-gray-500">
          <button
            type="button"
            className="bg-none border-none text-green-500 font-semibold cursor-pointer underline text-sm font-inherit hover:text-green-600"
            onClick={()=>{navigate("/login")}}
          >
            {inputFormConfig.signin_text}
          </button>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;