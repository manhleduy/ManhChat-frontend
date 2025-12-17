
// chat between two users interfaces

export interface ChatBlockInfo{
    id?:number;
    content:string;
    likeNum?:number;
    senderId:number;
    receiverId:number;
    isRead?: boolean;
    createdAt?:string;
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
//group chat interfaces
export interface DefaultGroupChatInfo{
    chatGroupId:string;
    adminId:string;
}
export interface GroupChatConnect extends DefaultGroupChatInfo{
    connectId: string;
    memberId:string;
}
export interface GroupChatBlock extends GroupChatConnect{
    groupChatBlockId:string;
    content: string;
    likeNum:number;
    timestamp:string;
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
    invitationId: string;
    senderId: string;
    receiverId: string;
    detail: string;
    sendAt:string;
}   

//group invitation interfaces

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


export const THEMES = [
  "light",
  "dark"
];
