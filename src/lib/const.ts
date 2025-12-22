import type { number } from "zod";

// chat blocks
export interface ChatBlockInfo{
    id?:number;
    content:string;
    likeNum?:number;
    file?:string;
    createdAt?:string;
    senderId:number;
    isRead?: boolean;
    profilePic?:string;
    name?:string
}
export interface FriendChatBlock extends ChatBlockInfo{
    receiverId:number,
    isRead?: boolean;

}
export interface GroupChatBlock extends ChatBlockInfo{
    groupId:number; 
}

//individual interfaces 
export interface UserDefaultInfo{
    id:number;
    name:string;
    address:string;
    email:string;
    profilePic:string;
    phonenumber:string;
    birthday:string;
}
export interface UserSignUpInfo extends UserDefaultInfo{
    password:string;
}
export interface UpdateUserInfo extends UserDefaultInfo{
    updateAt: string;
}
export interface UserLoginInfo{
    email:string;
    password:string;
}
export interface UserActivity{
    hoursActive: number;
    friendNum: number;
    groupNum: number;
    onlineHours: number;

}
//group 
export interface GroupDefaultInfo{
    id: number,
    detail: string,
    adminId: number, 
    groupName: string,
    createdAt:string,
    isRestricted: boolean
}
//group chat interfaces
export interface DefaultGroupChatInfo{
    chatGroupId:string;
    adminId:string;
}
export interface GroupChatConnect extends DefaultGroupChatInfo{
    connectId: string;
    memberId:string;
}

export interface GroupChatInfo extends DefaultGroupChatInfo{
    groupName: string;
    createdAt:string;

}
//post interfaces
export interface PostConnect{
    postId: string;
    userId: string;
}
export interface PostInfo extends PostConnect{
    postId:string;
    content: string;
    likeNumber: number;
    createdAt: string;
}
//invitation interfaces
export interface InvitationDefaultInfo{ 
    content: string;
    createdAt:string;
    id:number;
}   
export interface FriendRequest extends InvitationDefaultInfo{
    profilePic:string;
    name: string;
}
export interface GroupRequest extends InvitationDefaultInfo{
    detail: string;
    groupName: string;
    adminId: number
}

//group invitation interfaces

export type MessageType= FriendChatBlock | GroupChatBlock
//chatblock

//config for FriendList
export const FriendListConfig={
    sidebar_title: 'Messages',
    search_placeholder: 'Search conversations...',
    primary_color: '#0084ff',
    background_color: '#ffffff',
    surface_color: '#f0f2f5',
    text_color: '#050505',
    secondary_action_color: '#65676b',
}
export const inputFormConfig = {
  name_label: 'Name',
  email_label: 'Email',
  password_label: 'Password',
  confirm_password_label: 'Confirm Password',
  address_label: 'Address',
  phone_number_label: 'Phone Number',
  birthday_label: 'Birthday',
  submit_button: 'Sign Up',
  to_label: "Sent invitation to",
  content_label: "Content",
  signin_text: 'Already have an account? Sign in here',
  singup_text: "haven't had an account yet? Create now!"
};

export const AVATAR_GRADIENT= [
  'linear-gradient(135deg, #2196f3, #64b5f6)',
  'linear-gradient(135deg, #9c27b0, #ba68c8)',
  'linear-gradient(135deg, #ff9800, #ffb74d)',
  'linear-gradient(135deg, #4caf50, #81c784)',
  'linear-gradient(135deg, #f44336, #ef5350)',
  'linear-gradient(135deg, #00bcd4, #4dd0e1)',
  'linear-gradient(135deg, #673ab7, #9575cd)'
]

export const THEMES = [
  "light",
  "dark"
];
export type TypeEquality<T,U>= keyof T extends keyof U ? (keyof U extends keyof T ? true : false) : false;