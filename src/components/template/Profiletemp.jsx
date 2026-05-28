// import React from "react";
// import {
//   ArrowLeft,
//   Crown,
//   CheckCircle,
//   Info,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Progress } from "@/components/ui/progress";
// import {
//   Avatar,
//   AvatarImage,
//   AvatarFallback,
// } from "@/components/ui/avatar";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// // ⚡ Sidebar import (new)
// import Sidebar from "../organisms/Sidebar";

// const Profiletemp = () => {
//   return (
//     <div className="flex min-h-screen bg-[#f6fbff] text-gray-900">
//       {/* ⚡ Sidebar alag file se import */}
//       {/* <Sidebar /> */}

//       <main className="flex-1 p-10">
//         <div className="flex items-center mb-6">
//           <ArrowLeft className="w-5 h-5 text-gray-500 mr-2 cursor-pointer" />
//           <h1 className="text-2xl font-semibold">Profile Settings</h1>
//         </div>
//         <p className="text-gray-500 mb-8">
//           Manage your account information and preferences
//         </p>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <Card className="lg:col-span-2 shadow-sm border border-gray-200 rounded-2xl">
//             <CardContent className="p-8">
//               <div className="flex items-center mb-8">
//                 <Avatar className="h-16 w-16 mr-4">
//                   <AvatarImage src="/avatar.png" alt="User" />
//                   <AvatarFallback>U</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h2 className="font-medium text-gray-800">Profile Photo</h2>
//                   <p className="text-sm text-gray-500">
//                     Upload a new avatar for your account
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     First Name
//                   </label>
//                   <Input placeholder="Sarah" className="mt-1" />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     Last Name
//                   </label>
//                   <Input placeholder="Johnson" className="mt-1" />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="text-sm font-medium text-gray-700">
//                   Email Address
//                 </label>
//                 <Input
//                   placeholder="sarah.johnson@company.com"
//                   className="mt-1"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="text-sm font-medium text-gray-700">
//                   Country
//                 </label>
//                 <Input placeholder="United States" className="mt-1" />
//               </div>

//               <div className="mb-6">
//                 <label className="text-sm font-medium text-gray-700">
//                   Phone Number
//                 </label>
//                 <div className="flex mt-1 gap-2">
//                   <Select>
//                     <SelectTrigger className="w-[110px]">
//                       <SelectValue placeholder="+1" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="+1">🇺🇸 +1</SelectItem>
//                       <SelectItem value="+44">🇬🇧 +44</SelectItem>
//                       <SelectItem value="+91">🇮🇳 +91</SelectItem>
//                       <SelectItem value="+61">🇦🇺 +61</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Input placeholder="123 456 7890" className="flex-1" />
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <label className="text-sm font-medium text-gray-700">Bio</label>
//                 <Textarea
//                   placeholder="Passionate AI researcher with 8+ years of experience in machine learning and NLP."
//                   className="mt-1"
//                 />
//               </div>

//               <Button className="bg-black text-white hover:bg-gray-900 px-6">
//                 Save Changes
//               </Button>
//             </CardContent>
//           </Card>

//           <div className="space-y-6">
//             <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
//               <CardHeader className="pb-2 flex items-center justify-between">
//                 <CardTitle>Current Plan</CardTitle>
//                 <div className="p-2 rounded-lg bg-blue-100">
//                   <Crown className="w-5 h-5 text-blue-500" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex justify-between text-sm text-gray-700 py-1">
//                   <span>Plan</span>
//                   <span className="font-medium text-gray-900">Pro</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-700 py-1">
//                   <span>Price</span>
//                   <span className="font-medium">$29 / month</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-700 py-1">
//                   <span>Renewal</span>
//                   <span className="font-medium">Dec 15, 2024</span>
//                 </div>
//                 <Button
//                   variant="outline"
//                   className="mt-4 w-full border-gray-300 text-gray-700 hover:bg-gray-100"
//                 >
//                   Upgrade Plan
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
//               <CardHeader className="pb-2 flex items-center justify-between">
//                 <CardTitle>Usage This Month</CardTitle>
//                 <div className="p-2 rounded-lg bg-green-100">
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex justify-between text-sm text-gray-700 py-1">
//                   <span>API Calls</span>
//                   <span className="font-medium">8,420 / 10,000</span>
//                 </div>
//                 <Progress
//                   value={84}
//                   className="mb-3 h-2 bg-gray-200 [&>div]:bg-green-500"
//                 />

//                 <div className="flex justify-between text-sm text-gray-700 py-1">
//                   <span>Storage</span>
//                   <span className="font-medium">2.1 GB / 5 GB</span>
//                 </div>
//                 <Progress
//                   value={42}
//                   className="h-2 bg-gray-200 [&>div]:bg-blue-500"
//                 />
//               </CardContent>
//             </Card>

//             <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
//               <CardHeader className="pb-2 flex items-center justify-between">
//                 <CardTitle>Account Info</CardTitle>
//                 <div className="p-2 rounded-lg bg-purple-100">
//                   <Info className="w-5 h-5 text-purple-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex justify-between text-sm py-1 text-gray-700">
//                   <span>Member Since</span>
//                   <span className="font-medium">Jan 2023</span>
//                 </div>
//                 <div className="flex justify-between text-sm py-1 text-gray-700">
//                   <span>Account ID</span>
//                   <span className="font-medium">usr_8yk2m</span>
//                 </div>
//                 <div className="flex justify-between text-sm py-1 text-gray-700">
//                   <span>Status</span>
//                   <span className="font-medium text-green-600">Active</span>
//                 </div>
//                 <div className="flex justify-between text-sm py-1 text-gray-700">
//                   <span>2FA</span>
//                   <span className="font-medium text-green-600">Enabled</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Profiletemp;




import React, { useEffect } from "react";
import {
  ArrowLeft,
  Crown,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useProfile } from "@/context/ProfileProvider";

const Profiletemp = () => {
  const { profile, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);

  // 👇 Name split safe
  const firstName = profile?.full_name?.split(" ")[0] || "";
  const lastName = profile?.full_name?.split(" ")[1] || "";

  return (
    <div className="flex min-h-screen bg-[#f6fbff] text-gray-900">
      <main className="flex-1 p-10">

        <div className="flex items-start  justify-between gap-4 mb-6">



          {/* RIGHT SIDE (Heading + Text) */}
          <div>
            <div className="flex items-center">
              <ArrowLeft className="w-5 h-5 text-gray-500 mr-2 cursor-pointer" />
              <h1 className="text-2xl font-semibold">Profile Settings</h1>
            </div>

            <p className="text-gray-500 mt-2">
              Manage your account information and preferences.
            </p>
          </div>



          <div className="bg-white border h-20 w-32 px-4 py-2 rounded-xl flex items-center justify-center gap-2">
            <p className="text-sm text-black">Projects</p>
            <p className="text-lg font-medium text-black">
              {profile?.projectCount ?? 0}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <Card className="lg:col-span-2 shadow-sm border rounded-2xl">
            <CardContent className="p-8">

              {/* Avatar */}
              <div className="flex items-center mb-8">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage
                    src={
                      profile?.profile_image_url
                        ? `https://gateway.codeastra.ai/${profile.profile_image_url}`
                        : "/avatar.png"
                    }
                  />
                  <AvatarFallback>
                    {profile?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="font-medium text-gray-800">
                    Profile Photo
                  </h2>
                  <p className="text-sm text-gray-500">
                    Upload a new avatar for your account
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input value={profile?.full_name || ""} readOnly className="mt-1" />
                </div>

                {/* <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input value={lastName} readOnly className="mt-1" />
                </div> */}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm font-medium">Email</label>
                <Input value={profile?.registered_via || ""} readOnly className="mt-1" />
              </div>

              {/* Country */}
              <div className="mb-4">
                <label className="text-sm font-medium">Country</label>
                <Input value={profile?.country || ""} readOnly className="mt-1" />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="text-sm font-medium">Phone Number</label>

                <div className="flex mt-1 gap-2">
                  <Select defaultValue={profile?.country_phone_code} disabled>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder={profile?.country_phone_code} />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={profile?.country_phone_code}>
                        {profile?.country_phone_code}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={profile?.phone_number || ""}
                    readOnly
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="text-sm font-medium">Bio</label>
                <Textarea readOnly className="mt-1" />
              </div>

              <Button className="bg-black text-white px-6">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Plan */}
            <Card className="rounded-2xl border shadow-sm bg-white">
              <CardHeader className="pb-2 flex justify-between">
                <CardTitle>Current Plan</CardTitle>
                <Crown className="w-5 h-5 text-blue-500" />
              </CardHeader>

              <CardContent>
                <div className="flex justify-between text-sm py-1">
                  <span>Plan</span>
                  <span className="font-medium">Pro</span>
                </div>
              </CardContent>
            </Card>

            {/* Usage */}
            <Card className="rounded-2xl border shadow-sm bg-white">
              <CardHeader className="pb-2 flex justify-between">
                <CardTitle>Usage</CardTitle>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </CardHeader>

              <CardContent>
                <Progress value={84} className="h-2" />
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="rounded-2xl border shadow-sm bg-white">
              <CardHeader className="pb-2 flex justify-between">
                <CardTitle>Account Info</CardTitle>
                <Info className="w-5 h-5 text-purple-600" />
              </CardHeader>

              <CardContent>
                <div className="flex justify-between text-sm py-1">
                  <span>Account ID</span>
                  <span className="font-medium">{profile?.id}</span>
                </div>

                <div className="flex justify-between text-sm py-1">
                  <span>Status</span>
                  <span className="text-green-600">
                    {profile?.status ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex justify-between text-sm py-1">
                  <span>Verified</span>
                  <span className="text-green-600">
                    {profile?.is_verified ? "Yes" : "No"}
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profiletemp;
