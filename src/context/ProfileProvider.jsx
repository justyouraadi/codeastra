import { getUserProfileAPI } from "@/apis/Profile.Api";
import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await getUserProfileAPI();

      if (res?.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);