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
//schema for sign up schema
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
        .date()
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
//schema for sign in schema
export const signInSchema=z.object({
    password: z
        .string()
        .refine(val=>validatePassword(val)),
    email: z
        .email()
})
export type SignInSchema= z.infer<typeof signInSchema>;
//schema for sending friend invite
export const friendInviteSchema= z.object({
    name: z
        .string()
        .refine(val=>validateName(val)),
    email: z
        .email(),
    phonenumber:z
        .string()
        .refine(val=>validatePhoneNumber(val)),
    
    content: z
        .string()
        .refine(val=>validateContent(val)),
    

})
export type FriendInviteSchema= z.infer<typeof friendInviteSchema>;
//schema for sending group proposal
export const groupRequestSchema=z.object({
    groupName: z
        .string()
        .refine(val=>validateName(val)),
    content: z
        .string()
        .refine(val=>validateContent(val)),
    adminName:z
        .string()
        .refine(val=>validateName(val)),
    groupId: z
        .number()
})
export type GroupRequestSchema= z.infer<typeof groupRequestSchema>;

export const profileChangeSchema=z.object({
    name: z
        .string()
        .refine(val=>validateName(val)),
    address:z
        .string()
        .refine(val=>validateAddress(val)),
    birthday: z
        .date()
        .refine(val=>validateBirthday(val)),
    phonenumber:z
        .string()
        .refine(val=>validatePhoneNumber(val)),
    
})

export type ProfileChangeSchema= z.infer<typeof profileChangeSchema>;

export const postSchema= z.object({
    content:z
        .string()
        .refine(val=>validateContent(val))
})
export type PostSchema= z.infer<typeof postSchema>;

export const createGroupSchema= z.object({
    groupName:z
        .string()
        .refine(val=>validateName(val)),
    detail:z
        .string()
        .refine(val=>validateContent(val)),
    isRestricted:z
        .boolean()
})
export type CreateGroupSchema= z.infer<typeof createGroupSchema>;

export const otpSchema = z.object({
    otp: z
        .string()
        .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});
export type OTPSchema = z.infer<typeof otpSchema>;
    

