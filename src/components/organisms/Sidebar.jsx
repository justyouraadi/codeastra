import { Link } from "react-router-dom";
import {
  User, Shield, CreditCard, Bell, Key, Users, Settings
} from "lucide-react";

export default function Sidebar() {
  return (

<> 

    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col p-6">
      <h2 className="text-lg font-semibold mb-6">Settings</h2>

      <nav className="space-y-1 text-[15px] font-medium flex-1">
        <Link to="/profilepage" className="flex items-center px-3 py-2 rounded-md bg-gray-100 text-black cursor-pointer">
          <User className="w-4 h-4 mr-3" /> Profile
        </Link>
        <Link to="/securitypage" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
          <Shield className="w-4 h-4 mr-3 text-gray-600" /> Security
        </Link>
        <Link to="/billingpages" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
          <CreditCard className="w-4 h-4 mr-3 text-gray-600" /> Billing
        </Link>
        <Link to="/notificationspage" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
          <Bell className="w-4 h-4 mr-3 text-gray-600" /> Notifications
        </Link>
        <Link to="/apispage" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
          <Key className="w-4 h-4 mr-3 text-gray-600" /> API Keys
        </Link>
        <Link to="/teammanagementpages" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
          <Users className="w-4 h-4 mr-3 text-gray-600" /> Team
        </Link>
        <Link to="/preferencespages" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
          <Settings className="w-4 h-4 mr-3 text-gray-600" /> Preferences
        </Link>
      </nav>
    </aside>
</>
  );
}
