import React, { useState } from "react";
import { Shield, Lock, Bell, Monitor, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import InputAtom from "../atoms/InputAtom";
import FormTable from "../organisms/Table";

const Securitytemp = () => {
  const columns = ["Device", "Location", "Time", "Status"];
  const data = [
    { Device: "MacBook Pro - Chrome", Location: "San Francisco, CA", Time: "2 hours ago", Status: "Success" },
    { Device: "iPhone 14 - Safari", Location: "San Francisco, CA", Time: "1 day ago", Status: "Success" },
    { Device: "Windows PC - Edge", Location: "Unknown Location", Time: "3 days ago", Status: "Failed" },
  ];

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (field) => (e) => {
    setPasswordData({ ...passwordData, [field]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900 p-10">

      <div className="flex items-center mb-2">
        <Shield className="w-5 h-5 text-gray-500 mr-2" />
        <h1 className="text-2xl font-semibold">Security Settings</h1>
      </div>
      <p className="text-gray-500 mb-8">Manage your account protection and login safety</p>


      <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Security Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            <Card className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Auth</h3>
                    <p className="text-sm text-gray-500">Enabled</p>
                  </div>
                </div>
                <Switch checked />
              </div>
            </Card>

            <Card className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Login Alerts</h3>
                    <p className="text-sm text-gray-500">Enabled</p>
                  </div>
                </div>
                <Switch checked />
              </div>
            </Card>


            <Card className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Active Devices</h3>
                    <p className="text-sm text-gray-500">3 Active Sessions</p>
                  </div>
                </div>
                <Monitor className="w-5 h-5 text-blue-400" />
              </div>
            </Card>


            <Card className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">Password Strength</h3>
                    <Progress value={85} className="h-2 bg-gray-200 [&>div]:bg-green-500" />
                    <p className="text-sm text-green-600 mt-2">Strong</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>


      <Card className="rounded-2xl border border-gray-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-600" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <InputAtom
              type="password"
              placeholder="Enter current password"
              value={passwordData.current}
              onChange={handleChange("current")}
            />
            <InputAtom
              type="password"
              placeholder="Enter new password"
              value={passwordData.new}
              onChange={handleChange("new")}
            />
            <InputAtom
              type="password"
              placeholder="Re-enter new password"
              value={passwordData.confirm}
              onChange={handleChange("confirm")}
            />
            <Button className="mt-4 w-fit bg-black text-white hover:bg-gray-900">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <FormTable title="Login History" columns={columns} data={data} />

      <Card className="rounded-2xl border border-red-200 bg-red-50 shadow-sm mt-8">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-red-200 pb-4">
              <div>
                <h4 className="font-medium text-gray-800">Deactivate Account</h4>
                <p className="text-sm text-gray-500">
                  Temporarily disable your account. You can reactivate later.
                </p>
              </div>
              <Button variant="destructive">Deactivate</Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Delete Account Permanently</h4>
                <p className="text-sm text-gray-500">
                  This action is irreversible and cannot be undone.
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Securitytemp;
