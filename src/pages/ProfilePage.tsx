import React, { useEffect, useState } from 'react';
import ManhChatImage from '../assets/ManhChat.png';
import { Input } from '@/components/ui/input';
import { Camera, User, Home, Calendar, Phone, Edit2, X, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHook';
import { selectUserInfo } from '@/redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, updateUserInfo } from '@/lib/services/userService';
import toast from 'react-hot-toast';
// Form Imports
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Required for styling
import { type ProfileChangeSchema, profileChangeSchema } from '@/lib/inputSchema';
import { useFormContext } from 'react-hook-form';
import AsideBar from '@/components/AsideBar';
import { selectUserPostList } from '@/redux/PostListSlice';
import { getAllPost } from '@/lib/services/postService';
import Post from '@/components/Post';
type FieldDef = {
  name: keyof ProfileChangeSchema;
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: React.ReactNode;
};

const InputField: React.FC<{ field: FieldDef, isEditing:boolean, value:any }> = ({ field, isEditing, value }) => {
  const { register , formState: { errors } } = useFormContext<ProfileChangeSchema>();
  const error = errors[field.name as keyof typeof errors] as any | undefined;
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        {field.icon} {field.label}
      </label>
      <div className="relative">
        {!isEditing ? (
          <div className="py-3 px-4 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-900">
            {value || "Not provided"}
          </div>
          ) : (
            <Input {...register(field.name)} className="text-black" />
          )}
          {error && (
          <div className="text-red-600 text-sm mt-1.5 font-medium">
            {error.message}
          </div>
        )}
      </div>
    </div>
     
  )
}

const fields: FieldDef[] = [
  { name: 'name', id: 'name', label: 'Name', placeholder: 'Enter your name', icon: <User size={18} className="text-green-500" />},
  { name: 'address', id: 'address', label: 'Address', placeholder: 'Enter your address', icon: <Home size={18} className="text-green-500" />},
  { name: 'phonenumber', id: 'phonenumber', label: 'Phone Number', placeholder: 'Enter your phone number', icon: <Phone size={18} className="text-green-500" />},
]

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch= useAppDispatch()
  const currentUser = useAppSelector(selectUserInfo).info;
  const currentPost= useAppSelector(selectUserPostList);
  const [post, setPost]= useState(currentPost)

  // Initialize React Hook Form
  const methods = useForm<ProfileChangeSchema>({
    resolver: zodResolver(profileChangeSchema),
    mode: "onSubmit",
    defaultValues: {
      name: '',
      address: '',
      birthday: new Date(),
      phonenumber: '',
    }
  });

  const { handleSubmit, control, reset, setValue, getValues } = methods;
  
  // Authentication Guard
  useEffect(() => {
    if (currentUser.id <= 0) {
      navigate("/login");
    }
  }, [currentUser.id, navigate]);
  // Fetch Data and Populate Form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userinfo = await getUserInfo(currentUser.id, setError, setLoading);
        // Map API response to Form Schema
        const fetchedData = {
          name: userinfo.name,
          address: userinfo.address,
          // Ensure birthday is a Date object for the DatePicker
          birthday: new Date(userinfo.birthday), 
          phonenumber: userinfo.phonenumber,
        };
        reset(fetchedData);
      } catch (e) {
        toast.error("Failed to get your information");
      }
    };
    if (currentUser.id > 0) fetchData();
  }, [currentUser.id, reset]);
   
  useEffect(()=>{
    if(currentUser.id<=0) navigate('/');
    dispatch(getAllPost(currentUser.id)) 
  },[post, setPost])
  // Form Submit Handler
  const onSubmit =async (data: ProfileChangeSchema) => {
    if(!isEditing)return;
    try{
      await updateUserInfo(currentUser.id, data, setError, setLoading);
      
    }
    catch(e){
      console.log(e);
      toast.error("Failed to update profile");
    }
    finally{
      setIsEditing(false);
      toast.success("Profile updated locally!");
    }
  };
  

  const handleCancel = () => {
    reset(); // Reverts to the last provided 'defaultValues' (fetched data)
    setIsEditing(false);
  };

  return (
    <div className='flex h-full w-full'>
    <AsideBar/>
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-5 pt-10 pb-5" data-theme="dark">
      <main className="w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-green-700 mb-2">My Profile</h1>
          <p className="text-sm text-green-500">View and manage your personal information</p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-8 pt-8 pb-32 relative">
            
            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-green-100 to-green-200 border-4 border-green-500 flex items-center justify-center shadow-lg">
                  <img src={ManhChatImage} alt="Profile" className="w-20 h-20 object-contain rounded-full" />
                </div>
                <button type="button" onClick={() => alert('Upload logic here')} className="absolute bottom-0 right-0 w-8 h-8
                 bg-green-500 border-4 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-all shadow-md">
                  <Camera size={16} className="text-white" />
                </button>
              </div>
            </div>
            {/* Form Fields */}
            <div className="space-y-6">
              {fields.map(f => (
                  <InputField key={String(f.name)} field={f} isEditing={isEditing} value={getValues(f.name)} />
                ))
              }

              {/* Birthday Field (React DatePicker) */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  <Calendar size={18} className="text-green-500" /> Birthday
                </label>
                <div className="relative">
                  {!isEditing ? (
                    <div className="py-3 px-4 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-900">
                      {getValues('birthday')?.toISOString().slice(0, 10) || "Not provided"}
                    </div>
                    ) : (
                      <Controller
                        control={control}
                        name="birthday"
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={(date:any) => field.onChange(date)}
                            className="w-full py-3 px-4 border-2 border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none"
                            dateFormat="yyyy/MM/dd"
                          />
                        )}
                      />
                    )}
                </div>
              </div>

            </div>
            {/* Action Buttons */}
            <div className="absolute bottom-6 left-6 flex gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setTimeout(()=>{
                      setIsEditing(true);
                    },100)
                    }}
                  className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md hover:bg-green-600 transition-all"
                >
                  <Edit2 size={24} />
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md hover:bg-green-600 transition-all"
                  >
                    <Check size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                  >
                    <X size={24} />
                  </button>
                </>
              )}
            </div>
          </form>
        </FormProvider>
      </main>
      {
        post.map((item,index)=>(
          <Post props={item} key={index}/>
        ))
      }
    </div>
    
    </div>
  );
};

export default ProfilePage;