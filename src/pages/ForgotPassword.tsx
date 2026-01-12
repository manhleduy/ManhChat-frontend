import ChangePasswordForm from '@/components/ChangePasswordForm';
import InputOTP from '@/components/InputOTP';
import { sendOTP, verifyOTP } from '@/lib/services/userService';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate} from 'react-router-dom';
const ForgotPasswordOTP=(WrappedComponent: any)=>{
    return function EnhancedComponent(props:any){
        const {setLoading, setError, error, loading, setOpenOTP, setOpenPasswordForm}= props;
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
const ForgotPassword = ({props}:any) => {
    
  const navigate= useNavigate();
  const [inputEmail, setInputEmail]= useState("");
  const [openOTP, setOpenOTP]= useState(false)
  const [openPasswordForm, setOpenPasswordForm]= useState(false);
  const [error, setError]= useState<string>("")
  const [loading, setLoading]= useState(false);
  
  const handleSubmit=async()=>{

    if(!inputEmail){
        toast.error("type in your email first to continue");
        return;
    }
    try{
        await sendOTP(inputEmail, setError, setLoading);
        setOpenOTP(true);
        setOpenPasswordForm(false);
    }catch(e:any){
        console.log(e);
        toast.error(e.message);
    }
  }
  if(openOTP){
    const EnhancedOTP= ForgotPasswordOTP(InputOTP);
    return <EnhancedOTP 
    setLoading={setLoading}
    setError={setError}
    error={error}
    loading={loading}
    setOpenOTP={setOpenOTP}
    setOpenPasswordForm={setOpenPasswordForm}
     />
  }
  else if(openPasswordForm){
    return <ChangePasswordForm setError={setError} setLoading={setLoading} email={inputEmail}/>
  }else{
  return (
    <form className="bg-white  mt-40 flex flex-col text-gray-500 max-w-[400px] mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">forgot password?</h2>
        <input 
        onChange={(e)=>{setInputEmail(e.target.value)}} 
        id="email" 
        name="email"
        className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" 
        type="email" 
        placeholder="Enter your email" 
        required={true} />
        <button
          onClick={()=>{
            if(!inputEmail){
              toast.error("provide your email first")
            }
            handleSubmit()
            toast.success("we have sent an OTP email to your gmail please check now")     
            setOpenOTP(true);
            setOpenPasswordForm(false);
          }}
          className="w-full mb-3 bg-solidTwo hover:bg-green-600 active:scale-95 transition py-2.5 rounded-full text-black">Send an email to this </button>
        <p className="text-center mt-4 hover:cursor-auto"><a onClick={()=>navigate("/login")} className="text-blue-500 underline">login</a></p>
        <p className="text-center mt-4 hover:cursor-auto"><a onClick={()=>navigate("/signup")} className="text-blue-500 underline">Sign up</a></p>
    </form>
  )
    }
}

export default ForgotPassword