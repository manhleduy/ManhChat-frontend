export const validateName = (value: string): boolean => {
    return value.trim().length > 0;
};

export const validatePassword = (value: string): boolean => {
    return value.length >= 6;
};

export const validateAddress = (value: string): boolean => {
    return value.trim().length > 0;
};

export const validatePhoneNumber = (value: string): boolean => {
    const phoneRegex = /^\d{9,}$/;
    return phoneRegex.test(value.replace(/\D/g, ''));
};

export const validateBirthday = (value: string): boolean => {
    return value.length > 0;
};
export const validateEmail=(email:string):boolean =>{
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}
export const validateConfirmPassword= (value: string, password: string):boolean=>{
    return value=== password;
}
export const validateContent= (value: string):boolean=>{
    return value.length<=250;
}