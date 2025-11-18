import React, { useState } from "react";
import {
  Sun,
  Moon,
  Bell,
  Database,
  Eye,
  LayoutGrid,
  List,
  BarChart2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Preferencestemp = () => {
   const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("English");
  const [dashboardView, setDashboardView] = useState("cards");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [frequency, setFrequency] = useState("instant");
  const [collectUsage, setCollectUsage] = useState(true);
  const [personalizedRecs, setPersonalizedRecs] = useState(true);

  const handleSave = () => {
    console.log("Preferences Saved ", {
      theme,
      language,
      dashboardView,
      emailNotifications,
      pushNotifications,
      inAppAlerts,
      frequency,
      collectUsage,
      personalizedRecs,
    });
  };

  const handleReset = () => {
    setTheme("light");
    setLanguage("English");
    setDashboardView("cards");
    setEmailNotifications(true);
    setPushNotifications(false);
    setInAppAlerts(true);
    setFrequency("instant");
    setCollectUsage(true);
    setPersonalizedRecs(true);
  };

   return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900 p-8">
       <div className="mb-8">
        <h1 className="text-2xl font-semibold">Preferences</h1>
        <p className="text-gray-500 text-sm">
          Customize your Base44 experience the way you like.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
         <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-600" />
            )}
            <h3 className="font-semibold text-gray-800">Theme</h3>
          </div>
          <p className="text-sm text-gray-500">
            Pick your preferred interface theme.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm">Light Mode</span>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />
            <span className="text-sm">Dark Mode</span>
          </div>
        </Card>

         <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Language</h3>
          </div>
          <p className="text-sm text-gray-500">
            Select the language for your Base44 interface.
          </p>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="French">French</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

       <Card className="p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Default Dashboard View
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          Choose how your dashboard appears on login.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              key: "cards",
              title: "Cards View",
              desc: "Visual card layout",
              icon: <LayoutGrid className="w-5 h-5 text-indigo-600" />,
            },
            {
              key: "list",
              title: "List View",
              desc: "Compact list format",
              icon: <List className="w-5 h-5 text-gray-700" />,
            },
            {
              key: "analytics",
              title: "Analytics View",
              desc: "Data-focused display",
              icon: <BarChart2 className="w-5 h-5 text-blue-700" />,
            },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => setDashboardView(item.key)}
              className={`cursor-pointer border rounded-xl p-4 transition ${
                dashboardView === item.key
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {item.icon}
                <h4 className="font-medium text-gray-800 text-sm">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs text-gray-500 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-800">
              Notifications Preference
            </h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Set how and when you receive notifications.
          </p>

          <div className="space-y-3 leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Notifications</span>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notifications</span>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">In-App Alerts</span>
              <Switch
                checked={inAppAlerts}
                onCheckedChange={setInAppAlerts}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Frequency</p>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Instant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

         <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">
              Data & Privacy Preferences
            </h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Control how Base44 uses your data to personalize your experience.
          </p>

          <div className="space-y-3 leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="text-sm">Collect Usage Data</span>
              <Switch
                checked={collectUsage}
                onCheckedChange={setCollectUsage}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Personalized Recommendations</span>
              <Switch
                checked={personalizedRecs}
                onCheckedChange={setPersonalizedRecs}
              />
            </div>
          </div>
        </Card>
      </div>

      <Separator className="my-8" />

       <div className="flex gap-3 justify-center ">
        <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-900">
          Save Preferences
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
      </div>
    </main>
  );
};

export default Preferencestemp;
