import {z} from "zod";
import {
validateEmail,
validateBirthday,
validateName,
validatePassword,
validatePhoneNumber,
validateAddress,
validateContent,
} from '@/lib/validateInput';
export const signUpSchema = z.object({
    email: z
        .email()
        .refine(val=>validateEmail(val)),
    name: z
        .string()
        .refine(val=>validateName(val)),
    password: z
        .string()
        .refine(val=>validatePassword(val)),
    confirmPassword: z
        .string(),
    phonenumber: z
        .string()
        .refine(val=>validatePhoneNumber(val)),
    address: z
        .string()
        .refine(val=>validateAddress(val)),
    birthday: z
        .string()
        .refine(val=>validateBirthday(val))  
    }).superRefine((data,ctx)=>{
        if(data.password!==data.confirmPassword){
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path:['confirmPassword']
            })
        }
    })
export type SignUpSchema=  z.infer<typeof signUpSchema>;

export const signInSchema=z.object({
    email: z
        .string()
        .refine(val=>validateEmail(val)),
    name: z
        .string()
        .refine(val=>validateName(val))
})
export type SignInSchema= z.infer<typeof signInSchema>;

export const inviteSchema= z.object({
    to: z
        .string()
        .refine(val=>validateName(val)),
    content: z
        .string()
        .refine(val=>validateContent(val))

})
export type InviteSchema= z.infer<typeof inviteSchema>;

export const otpSchema = z.object({
    otp: z
        .string()
        .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});
export type OTPSchema = z.infer<typeof otpSchema>;
