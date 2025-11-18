import React from "react";
import { Bell, Mail, Smartphone, CreditCard, Info, Star, Users, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import FormCard from "../organisms/FormCard";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const Notificationstemp = () => {
  const categories = ["All", "System", "Billing", "AI Updates", "Team"];

  const notifications = [
    {
      id: 1,
      title: "Payment Successful",
      description: "Your Pro Plan payment of ₹499 was processed successfully.",
      time: "2 hours ago",
      bgColor: "bg-blue-50",
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
      textColor: "text-gray-800",
    },
    {
      id: 2,
      title: "System Update",
      description: "Version 2.4 brings improved AI response time and better accuracy.",
      time: "Yesterday",
      bgColor: "bg-white",
      icon: <Info className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      textColor: "text-gray-800",
    },
    {
      id: 3,
      title: "New Feature Unlocked",
      description: "You've unlocked “AI Prompt Insights”. Explore it in your dashboard!",
      time: "3 days ago",
      bgColor: "bg-purple-50",
      icon: <Star className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-100",
      textColor: "text-gray-800",
    },
    {
      id: 4,
      title: "Team Invite Accepted",
      description: "Priya joined your Base44 team.",
      time: "5 days ago",
      bgColor: "bg-green-50",
      icon: <Users className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
      textColor: "text-gray-800",
    },
    {
      id: 5,
      title: "Login Alert",
      description: "New login detected from Windows device.",
      time: "1 week ago",
      bgColor: "bg-red-50",
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      iconBg: "bg-red-100",
      textColor: "text-gray-800",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900 p-8">
       <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Notifications & Alerts</h1>
          <p className="text-gray-500 text-sm">
            Manage your alerts, reminders, and product updates in one place.
          </p>
        </div>
        <Button variant="outline" className="text-sm font-medium">
          Mark All as Read
        </Button>
      </div>

       <div className="flex flex-wrap gap-4 mb-6">
        <Card className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50 w-full sm:w-64">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">App Notifications</span>
          </div>
          <Switch defaultChecked />
        </Card>

        <Card className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 w-full sm:w-64">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Email Alerts</span>
          </div>
          <Switch />
        </Card>

        <Card className="flex items-center justify-between px-4 py-3 rounded-xl bg-green-50 w-full sm:w-64">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Mobile Push</span>
          </div>
          <Switch defaultChecked />
        </Card>
      </div>

       <div className="flex gap-6 border-b border-gray-200 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className="text-gray-600 pb-2 text-sm hover:text-black relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-black after:transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

       <div className="flex flex-col gap-3">
        {notifications.map((item) => (
          <FormCard
            key={item.id}
            title={item.title}
            description={item.description}
            author={item.time}
            createdAt=""
            icon={item.icon}
            bgColor={item.bgColor}
            iconBg={item.iconBg}
            textColor={item.textColor}
          />
        ))}
      </div>

       <div className="flex flex-col sm:flex-row items-center justify-between mt-8 border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500">
          Manage Notifications — Customize your notification preferences
        </p>
        <div className="flex gap-3 mt-3 sm:mt-0">
          <Button variant="outline">Manage Notification Preferences</Button>
          <Button className="bg-black text-white hover:bg-gray-900">
            Clear All Notifications
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Notificationstemp;
