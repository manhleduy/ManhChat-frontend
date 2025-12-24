import React, { useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OTPSchema } from '@/lib/inputSchema';

const InputOTP: React.FC = () => {
  
  const methods = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = methods;
  const otp = watch('otp');
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits or empty

    const newOtp = otp.split('');
    newOtp[index] = value;
    const updatedOtp = newOtp.join('');
    setValue('otp', updatedOtp);

    // Move to next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = (data: OTPSchema) => {
    console.log('OTP submitted:', data.otp);
    // Handle OTP verification here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the 6-digit code sent to your device
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {Array.from({ length: 6 }, (_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={otp[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-red-500 text-center text-sm">{errors.otp.message}</p>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Verify OTP
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default InputOTP;