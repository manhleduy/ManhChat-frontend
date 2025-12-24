import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ManhChatImage from '../assets/ManhChat.png';
import { signInSchema,type SignInSchema } from '@/lib/inputSchema';
import { inputFormConfig } from '@/lib/const';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHook';
import { Login as LoginAction } from '@/lib/services/userService';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { selectUserInfo } from '@/redux/userSlice';
const defaultConfig = {
  page_title: 'Welcome Back',
  name_label: inputFormConfig.name_label,
  email_label: inputFormConfig.email_label,
  submit_button: 'Login',
  signup_text: 'Sign up here',
  forgot_password_text: 'Forgot your password?',
};

const Login: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [config, setConfig] = useState<typeof defaultConfig>(defaultConfig);
  const [showPassword, setShowPassword] = useState(false);
  const currentUser= useAppSelector(selectUserInfo);
  const dispatch =useAppDispatch();
  const navigate= useNavigate();
  useEffect(() => {
    const sdk = (window as any).elementSdk;
    if (!sdk) return;

    const onConfigChange = (newConfig: any) => {
      setConfig(prev => ({ ...prev, ...newConfig }));
    };

    try {
      sdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: () => ({
          recolorables: [],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined,
        }),
        mapToEditPanelValues: (cfg: any) =>
          new Map([
            ['page_title', cfg.page_title || defaultConfig.page_title],
            ['name_label', cfg.name_label || defaultConfig.name_label],
            ['email_label', cfg.email_label || defaultConfig.email_label],
            ['submit_button', cfg.submit_button || defaultConfig.submit_button],
            ['signup_text', cfg.signup_text || defaultConfig.signup_text],
            ['forgot_password_text', cfg.forgot_password_text || defaultConfig.forgot_password_text],
          ]),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('elementSdk init failed', err);
    }
  }, []);
  
  // form setup using zod resolver
  const methods = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: 'onSubmit',
    defaultValues: { password: '', email: '' },
  });

  const { handleSubmit } = methods;

  const onSubmit = async(data: SignInSchema) => {
    try{
      
      await dispatch(LoginAction(data))
    }catch(e:any){
      console.log(e);
      toast.error(e.message);
    }finally{
      setTimeout(()=>{
        if(currentUser.status==="failed"){
          toast.error(currentUser.error)
        }else{
          toast.success("Login successfully");
          navigate('/');
        }
      }, 5000);
      
        
    }

  };

  // small InputField that uses FormProvider context
  type FieldDef = { name: keyof SignInSchema; id: string; label: string; type?: string; placeholder?: string };
  const InputField: React.FC<{ field: FieldDef; showPassword?: boolean; setShowPassword?: (value: boolean) => void }> = ({ field, showPassword, setShowPassword }) => {
    const { register, formState: { errors } } = useFormContext<SignInSchema>();
    const error = errors[field.name as keyof typeof errors] as any | undefined;
    return (
      <div className="mb-6">
        <label htmlFor={field.id} className="block text-sm font-semibold text-green-800 mb-2">{field.label}</label>
        <div className="relative">
          <input
            id={field.id}
            type={field.name === 'password' ? (showPassword ? 'text' : 'password') : (field.type || 'text')}
            placeholder={field.placeholder}
            {...register(field.name as any)}
            className={`w-full px-4 py-3 pr-10 border-2 rounded-lg text-base font-normal bg-white text-gray-900 placeholder-gray-400 outline-none transition-all ${
              error ? 'border-red-500' : 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-100'
            }`}
          />
          {field.name === 'password' && setShowPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {error && <div className="text-red-600 text-sm mt-1.5 font-medium">{String(error.message)}</div>}
      </div>
    );
  };

  const fields: FieldDef[] = [
    { name: 'password', id: 'password', label: "Your password",type: 'password', placeholder: 'Enter your name' },
    { name: 'email', id: 'email', label: config.email_label, type: 'email', placeholder: 'Enter your email' },
  ];


  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-5">
      <main className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-32 h-32 mx-auto mb-6">
            <img src={ManhChatImage} alt="ManhChat Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">{config.page_title}</h1>
          <p className="text-base text-gray-500">Please login to your account</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4 text-green-800 font-medium text-center">
            Login successful! Welcome back.
          </div>
        )}

        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 mb-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {fields.map(f => (
                <InputField key={String(f.name)} field={f} showPassword={f.name === 'password' ? showPassword : undefined} setShowPassword={f.name === 'password' ? setShowPassword : undefined} />
              ))}

              <button
                type="submit"
                className="w-full py-3.5 bg-green-500 text-white rounded-lg text-base font-semibold cursor-pointer border-none transition-all hover:bg-green-600 hover:-translate-y-px hover:shadow-lg active:translate-y-0 disabled:bg-green-300 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {config.submit_button}
              </button>
            </form>
          </FormProvider>
        </div>

        {/* Links */}
        <div className="text-center">
          <div className="mb-3 text-sm text-gray-500">
            <span>Don't have an account? </span>
            <button 
            type="button" 
            className="bg-none border-none text-green-500 font-semibold cursor-pointer underline text-sm font-inherit hover:text-green-600" 
            onClick={()=>{navigate("/signup")}}>
              {config.signup_text}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            <button 
            type="button" 
            className="bg-none border-none text-green-500 font-semibold cursor-pointer underline text-sm font-inherit hover:text-green-600" 
            onClick={()=>{navigate("/forgotpassword")}}>
              {config.forgot_password_text}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
