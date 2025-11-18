import React from "react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// ⚡ Sidebar import (new)
import Sidebar from "../organisms/Sidebar";

const Profiletemp = () => {
  return (
    <div className="flex min-h-screen bg-[#f6fbff] text-gray-900">
      {/* ⚡ Sidebar alag file se import */}
      {/* <Sidebar /> */}

      <main className="flex-1 p-10">
        <div className="flex items-center mb-6">
          <ArrowLeft className="w-5 h-5 text-gray-500 mr-2 cursor-pointer" />
          <h1 className="text-2xl font-semibold">Profile Settings</h1>
        </div>
        <p className="text-gray-500 mb-8">
          Manage your account information and preferences
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-sm border border-gray-200 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium text-gray-800">Profile Photo</h2>
                  <p className="text-sm text-gray-500">
                    Upload a new avatar for your account
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input placeholder="Sarah" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input placeholder="Johnson" className="mt-1" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  placeholder="sarah.johnson@company.com"
                  className="mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Country
                </label>
                <Input placeholder="United States" className="mt-1" />
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="flex mt-1 gap-2">
                  <Select>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="+1" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="123 456 7890" className="flex-1" />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <Textarea
                  placeholder="Passionate AI researcher with 8+ years of experience in machine learning and NLP."
                  className="mt-1"
                />
              </div>

              <Button className="bg-black text-white hover:bg-gray-900 px-6">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
              <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle>Current Plan</CardTitle>
                <div className="p-2 rounded-lg bg-blue-100">
                  <Crown className="w-5 h-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-700 py-1">
                  <span>Plan</span>
                  <span className="font-medium text-gray-900">Pro</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 py-1">
                  <span>Price</span>
                  <span className="font-medium">$29 / month</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 py-1">
                  <span>Renewal</span>
                  <span className="font-medium">Dec 15, 2024</span>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
              <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle>Usage This Month</CardTitle>
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-700 py-1">
                  <span>API Calls</span>
                  <span className="font-medium">8,420 / 10,000</span>
                </div>
                <Progress
                  value={84}
                  className="mb-3 h-2 bg-gray-200 [&>div]:bg-green-500"
                />

                <div className="flex justify-between text-sm text-gray-700 py-1">
                  <span>Storage</span>
                  <span className="font-medium">2.1 GB / 5 GB</span>
                </div>
                <Progress
                  value={42}
                  className="h-2 bg-gray-200 [&>div]:bg-blue-500"
                />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
              <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle>Account Info</CardTitle>
                <div className="p-2 rounded-lg bg-purple-100">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm py-1 text-gray-700">
                  <span>Member Since</span>
                  <span className="font-medium">Jan 2023</span>
                </div>
                <div className="flex justify-between text-sm py-1 text-gray-700">
                  <span>Account ID</span>
                  <span className="font-medium">usr_8yk2m</span>
                </div>
                <div className="flex justify-between text-sm py-1 text-gray-700">
                  <span>Status</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between text-sm py-1 text-gray-700">
                  <span>2FA</span>
                  <span className="font-medium text-green-600">Enabled</span>
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
