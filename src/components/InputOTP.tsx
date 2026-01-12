import React, { useRef, useState, useEffect } from 'react';

const InputOTP: React.FC = (props:any) => {
  const {
    setInput,
    input,
    handleSubmit,
  }= props;
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const setRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits or empty

    const newOtp = input.split('');
    newOtp[index] = value;
    const updatedOtp = newOtp.join('');
    setInput(updatedOtp);

    // Move to next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !input[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 ">
      
      <div className="max-w-md w-full space-y-8 p-6 sm:p-8 bg-white rounded-lg shadow-md border-green-600 border-4">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Enter OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the 6-digit code sent to your device
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-1 sm:space-x-2">
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                ref={setRef(index)}
                type="text"
                maxLength={1}
                value={input[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-600">
            OTP expires in: {formattedTime}
          </p>

          <div>
            <button
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputOTP;