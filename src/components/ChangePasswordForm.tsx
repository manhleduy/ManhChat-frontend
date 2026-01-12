import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { changePasswordSchema, type ChangePasswordSchema } from '@/lib/inputSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserPassword } from '@/lib/services/userService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type FieldDef = {
    name: keyof ChangePasswordSchema;
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
};

const InputField: React.FC<{ field: FieldDef }> = ({ field }) => {
    const { register, formState: { errors } } = useFormContext<ChangePasswordSchema>();
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
                className="w-full px-4 py-3 border-2 rounded-lg text-base font-normal bg-white text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
            {error && (
                <div className="text-red-600 text-sm mt-1.5 font-medium">
                    {error.message}
                </div>
            )}
        </div>
    );
};

const ChangePasswordForm = (props:any) => {
    const {email, setError, setLoading}= props;
    const navigate= useNavigate();
    const methods = useForm<ChangePasswordSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const { handleSubmit } = methods;

    const onSubmit =async (data: ChangePasswordSchema) => {
        try{
            await updateUserPassword(email, data.newPassword, setError, setLoading);
            toast.success("Password changed successfully");
        }catch(e:any){
            console.log(e);
            toast.error(e);
        }
        // User will add logic later
        setInterval(()=>{
            navigate("/login")
        }, 1000)
    };

    const fields: FieldDef[] = [
        {
            name: 'newPassword',
            id: 'newPassword',
            label: 'New Password',
            type: 'password',
            placeholder: 'Enter your new password',
        },
        {
            name: 'confirmPassword',
            id: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
            placeholder: 'Confirm your new password',
        },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
                    Change Password
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Please enter your new password and confirm it.
                </p>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {fields.map((field) => (
                            <InputField key={field.id} field={field} />
                        ))}
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Change Password
                        </button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default ChangePasswordForm;
