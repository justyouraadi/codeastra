import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import InputAtom from "../atoms/InputAtom";
import ButtonAtom from "../atoms/ButtonAtom";
import SideimagsForm from "../molecules/SideimagsForm";
import { Label } from "../ui/label";
import { useAuth } from "../../context/ContextProvider";

const CreateProfile = ({
  onBack,
  formData = {
    title: "Create Your Account",
    subtitle: "Join Base44 and start learning smarter today.",
    nameLabel: "Full Name",
    emailLabel: "Email",
    countryLabel: "Country",
    phoneLabel: "Phone Number",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "Enter your email",
    countryPlaceholder: "Select country",
    phonePlaceholder: "Enter phone number",
    buttonText: "Create Account",
  },
}) => {
  const navigate = useNavigate();
  const { createProfile, loading, error } = useAuth();

  const [profileImage, setProfileImage] = useState(null);
  const [formValues, setFormValues] = useState({
    full_name: "",
    email: "",
    country: "",
    country_phone_code: "+91",
    phone_number: "",
  });

  // Prefill email from JWT
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setFormValues((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  // Input change handler
  const handleChange = (field, value) =>
    setFormValues((prev) => ({ ...prev, [field]: value }));

  // Profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(file);
  };

  // Submit handler
  const handleSubmit = async () => {
    const order_id = localStorage.getItem("order_id");
    if (!order_id) {
      toast.error("Missing order_id. Please complete verification first.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries({
      ...formValues,
      order_id,
    }).forEach(([key, value]) => formDataToSend.append(key, value));

    if (profileImage) formDataToSend.append("profile", profileImage);

    const toastId = toast.loading("Creating your account...");

    try {
      const response = await createProfile(formDataToSend);
      toast.dismiss(toastId);

      if (response?.success) {
        toast.success("🎉 Account created successfully!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(response?.message || "Signup failed.");
      }
    } catch (err) {
      toast.dismiss(toastId);
      console.error("Signup error:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white overflow-hidden">
      {/* ---------- Left Section ---------- */}
      <div className="flex-1 flex items-center justify-center p-4 bg-[#f7fbff] relative">
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center text-sm text-gray-700 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="w-full max-w-sm space-y-5 bg-white/50 backdrop-blur-md rounded-xl p-6 shadow-sm">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {formData.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{formData.subtitle}</p>
          </div>

          {/* Profile Upload */}
          <div className="flex justify-center">
            <div className="relative w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Camera className="text-gray-500 w-6 h-6" />
              )}
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1 cursor-pointer hover:bg-gray-800"
              >
                <Camera size={12} />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Full Name */}
            <div>
              <Label className="text-xs">{formData.nameLabel}</Label>
              <InputAtom
                placeholder={formData.namePlaceholder}
                value={formValues.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className="w-full mt-1 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <Label className="text-xs">{formData.emailLabel}</Label>
              <InputAtom
                placeholder={formData.emailPlaceholder}
                type="email"
                value={formValues.email}
                disabled
                className="w-full mt-1 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Country */}
            <div>
              <Label className="text-xs">{formData.countryLabel}</Label>
              <select
                value={formValues.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full py-2 mt-1 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                <option value="">Select Country</option>
                <option value="India">🇮🇳 India</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="Canada">🇨🇦 Canada</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <Label className="text-xs">{formData.phoneLabel}</Label>
              <div className="flex mt-1">
                <select
                  value={formValues.country_phone_code}
                  onChange={(e) =>
                    handleChange("country_phone_code", e.target.value)
                  }
                  className="px-2 border border-gray-300 rounded-l-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="+1">+1</option>
                  <option value="+91">+91</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                </select>
                <InputAtom
                  placeholder={formData.phonePlaceholder}
                  type="tel"
                  value={formValues.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  className="w-full py-2 rounded-l-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <ButtonAtom
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full text-white py-2 rounded-md text-sm transition ${
              loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Creating..." : formData.buttonText}
          </ButtonAtom>

          {/* Error message */}
          {error && (
            <p className="text-center text-red-500 text-xs mt-2">{error}</p>
          )}
        </div>
      </div>

      {/* ---------- Right Section (Image Side) ---------- */}
      <div className="flex-1 hidden lg:flex">
        <SideimagsForm />
      </div>
    </div>
  );
};

export default CreateProfile;
