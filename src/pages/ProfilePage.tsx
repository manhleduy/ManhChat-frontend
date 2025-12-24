import React, { useEffect, useState } from 'react';
import ManhChatImage from '../assets/ManhChat.png';
import { Input } from '@/components/ui/input';
import { Camera, User, Home, Calendar, Phone, Edit2, X, Check } from 'lucide-react';
import { useAppSelector } from '@/redux/reduxHook';
import { selectUserInfo } from '@/redux/userSlice';
import { useNavigate } from 'react-router-dom';

const defaultConfig = {
  user_name: 'John Doe',
  user_address: '123 Main Street, New York, NY 10001',
  user_birthday: 'January 15, 1990',
  user_phone: '+1 (555) 123-4567',
};

type ProfileData = {
  name: string;
  address: string;
  birthday: string;
  phone: string;
};

const ProfilePage: React.FC = () => {
    const navigate= useNavigate();
    const currentUser= useAppSelector(selectUserInfo).info
    if(currentUser.id<=0){
      navigate("/login");
    }
  const [profileData, setProfileData] = useState<ProfileData>({
    name: defaultConfig.user_name,
    address: defaultConfig.user_address,
    birthday: defaultConfig.user_birthday,
    phone: defaultConfig.user_phone,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState<typeof defaultConfig>(defaultConfig);

  useEffect(() => {
    const sdk = (window as any).elementSdk;
    if (!sdk) return;

    const onConfigChange = (newConfig: any) => {
      setConfig(prev => ({ ...prev, ...newConfig }));
      setProfileData({
        name: newConfig.user_name || defaultConfig.user_name,
        address: newConfig.user_address || defaultConfig.user_address,
        birthday: newConfig.user_birthday || defaultConfig.user_birthday,
        phone: newConfig.user_phone || defaultConfig.user_phone,
      });
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
            ['user_name', cfg.user_name || defaultConfig.user_name],
            ['user_address', cfg.user_address || defaultConfig.user_address],
            ['user_birthday', cfg.user_birthday || defaultConfig.user_birthday],
            ['user_phone', cfg.user_phone || defaultConfig.user_phone],
          ]),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('elementSdk init failed', err);
    }
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const sdk = (window as any).elementSdk;
    if (sdk) {
      sdk.setConfig({
        user_name: profileData.name,
        user_address: profileData.address,
        user_birthday: profileData.birthday,
        user_phone: profileData.phone,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      name: config.user_name || defaultConfig.user_name,
      address: config.user_address || defaultConfig.user_address,
      birthday: config.user_birthday || defaultConfig.user_birthday,
      phone: config.user_phone || defaultConfig.user_phone,
    });
    setIsEditing(false);
  };

  const handleCameraClick = () => {
    alert('Profile picture upload would open here');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 pt-10 pb-5"  data-theme="dark">
      <main className="w-full max-w-xl">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-green-700 mb-2">My Profile</h1>
          <p className="text-sm text-green-500">View and manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-8 pt-8 pb-30 relative">
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-green-100 to-green-200 border-4 border-green-500 flex items-center justify-center shadow-lg">
                <img
                  src={ManhChatImage}
                  alt="Profile"
                  className="w-20 h-20 object-contain rounded-full"
                />
              </div>
              <button
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 hover:scale-110 active:scale-95 transition-all shadow-md"
                aria-label="Change profile picture"
              >
                <Camera size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                <User size={18} className="text-green-500" />
                Name
              </label>
              <div className="relative">
                {!isEditing ? (
                  <div className="py-3 px-4 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-900">
                    {profileData.name}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={profileData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="py-3 px-4 border-2 border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-lg text-base font-medium bg-white text-gray-900"
                  />
                )}
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                <Home size={18} className="text-green-500" />
                Address
              </label>
              <div className="relative">
                {!isEditing ? (
                  <div className="py-3 px-4 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-900">
                    {profileData.address}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={profileData.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                    className="py-3 px-4 border-2 border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-lg text-base font-medium bg-white text-gray-900"
                  />
                )}
              </div>
            </div>

            {/* Birthday Field */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                <Calendar size={18} className="text-green-500" />
                Birthday
              </label>
              <div className="relative">
                {!isEditing ? (
                  <div className="py-3 px-4 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-900">
                    {profileData.birthday}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={profileData.birthday}
                    onChange={e => handleInputChange('birthday', e.target.value)}
                    className="py-3 px-4 border-2 border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-lg text-base font-medium bg-white text-gray-900"
                  />
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                <Phone size={18} className="text-green-500" />
                Phone Number
              </label>
              <div className="relative">
                {!isEditing ? (
                  <div className="py-3 px-4 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-900">
                    {profileData.phone}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={profileData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    className="py-3 px-4 border-2 border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-lg text-base font-medium bg-white text-gray-900"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-green-600 hover:scale-105 active:scale-95 transition-all"
              aria-label={isEditing ? 'Save changes' : 'Edit profile'}
            >
              {isEditing ? (
                <Check size={24} />
              ) : (
                <Edit2 size={24} />
              )}
            </button>

            {isEditing && (
              <button
                onClick={handleCancel}
                className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                aria-label="Cancel editing"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;