import React, { useState } from "react";
import { KeyRound, Trash2, BarChart, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import FormCard from "../organisms/FormCard";
import GenerateKeyModal from "../organisms/ApiAccessPage";

const ApisTemp = () => {
   const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    keyName: "",
    accessType: "",
    usageLimit: "",
    expirationDate: "",
    allowedIPs: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log("Generated Key Data:", formData);
    setOpen(false);
  };

   const apiKeys = [
    {
      id: 1,
      title: "Main App Key",
      description: (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono bg-white px-3 py-1 border rounded-md">
              sk-********d92f
            </span>
            <KeyRound className="w-4 h-4 text-gray-600 cursor-pointer" />
          </div>
          <p className="text-xs mt-2 text-gray-600">Created on 12 Aug 2025</p>
        </>
      ),
      icon: <KeyRound className="w-6 h-6 text-green-600" />,
      iconBg: "bg-green-100",
      bgColor: "bg-blue-50",
      textColor: "text-gray-900",
      status: "Active",
    },
    {
      id: 2,
      title: "Development Key",
      description: (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono bg-white px-3 py-1 border rounded-md">
              sk-********a8c3
            </span>
            <KeyRound className="w-4 h-4 text-gray-600 cursor-pointer" />
          </div>
          <p className="text-xs mt-2 text-gray-600">Created on 08 Aug 2025</p>
        </>
      ),
      icon: <KeyRound className="w-6 h-6 text-green-600" />,
      iconBg: "bg-green-100",
      bgColor: "bg-green-50",
      textColor: "text-gray-900",
      status: "Active",
    },
    {
      id: 3,
      title: "Testing Environment",
      description: (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono bg-white px-3 py-1 border rounded-md">
              sk-********k7e9
            </span>
            <KeyRound className="w-4 h-4 text-gray-600 cursor-pointer" />
          </div>
          <p className="text-xs mt-2 text-gray-600">Created on 28 Jul 2025</p>
        </>
      ),
      icon: <KeyRound className="w-6 h-6 text-red-600" />,
      iconBg: "bg-red-100",
      bgColor: "bg-yellow-50",
      textColor: "text-gray-900",
      status: "Expired",
    },
  ];

   return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900 p-8">
       <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">API Access</h1>
          <p className="text-gray-500 text-sm">
            Manage and monitor your API keys securely.
          </p>
        </div>

         <Button
          onClick={() => setOpen(true)}
          className="bg-black text-white hover:bg-gray-900"
        >
          + Generate New Key
        </Button>

        <GenerateKeyModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          {...formData}
          onChange={handleChange}
        />
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> 
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-1">Active API Keys</h2>

          {apiKeys.map((key) => (
            <div
              key={key.id}
              className={`relative p-5 rounded-xl border border-gray-200 ${key.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{key.title}</h3>
                </div>
                <span
                  className={`text-xs font-medium ${
                    key.status === "Active"
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  } px-2 py-1 rounded-full`}
                >
                  ● {key.status}
                </span>
              </div>

              <div>{key.description}</div>

              <Trash2 className="w-4 h-4 text-red-500 absolute right-5 bottom-5 cursor-pointer" />
            </div>
          ))}
        </div>
 
        <div className="flex flex-col gap-4"> 
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart className="w-4 h-4 text-gray-700" />
              <h3 className="font-semibold text-gray-800 text-sm">
                Usage Overview
              </h3>
            </div>

            <div className="space-y-1 mb-2">
              <p className="text-sm text-gray-600 leading-tight">
                API Calls This Month
              </p>

              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-gray-900">12,450</p>
                <p className="text-sm text-gray-500">/ 50,000</p>
              </div>

              <Progress value={25} className="h-2 mt-3 mb-2" />

              <p className="text-xs text-gray-500 leading-snug">
                You’ve used{" "}
                <span className="font-medium text-gray-700">25%</span> of your
                monthly limit.
              </p>
            </div>
          </Card>
 
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-gray-800 text-sm">
                API Documentation
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Read our API documentation to integrate Base44 AI with your
              product.
            </p>
            <Button variant="outline" className="w-full">
              View Docs
            </Button>
          </Card>
 
          <Card className="p-5 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-yellow-600" />
              <h3 className="font-semibold text-gray-800 text-sm">
                Security Tip
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              Never share your API key publicly. You can regenerate it anytime
              for safety.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ApisTemp;
