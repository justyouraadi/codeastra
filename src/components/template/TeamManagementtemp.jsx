import React from "react";
import {
  Pencil,
  Trash2,
  RefreshCcw,
  UserPlus,
  Users as UsersIcon,
  Shield,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

 
import avatar1 from "../../assets/aadba6f558201e8d67536b2d83934f57c9ec6b5d.jpg";
import avatar2 from "../../assets/aadba6f558201e8d67536b2d83934f57c9ec6b5d.jpg";
import avatar3 from "../../assets/aadba6f558201e8d67536b2d83934f57c9ec6b5d.jpg";
import avatar4 from "../../assets/aadba6f558201e8d67536b2d83934f57c9ec6b5d.jpg";
import avatar5 from "../../assets/aadba6f558201e8d67536b2d83934f57c9ec6b5d.jpg";

const TeamManagementtemp = ({ members: propMembers }) => {
  const defaultMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@company.com",
      avatarUrl: avatar1,
      role: "Admin",
      roleColor: "bg-rose-50 text-rose-600",
      status: "Active",
      statusColor: "bg-green-50 text-green-600",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@company.com",
      avatarUrl: avatar2,
      role: "Admin",
      roleColor: "bg-rose-50 text-rose-600",
      status: "Active",
      statusColor: "bg-green-50 text-green-600",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "David Rodriguez",
      email: "david@company.com",
      avatarUrl: avatar3,
      role: "Editor",
      roleColor: "bg-sky-50 text-sky-600",
      status: "Active",
      statusColor: "bg-green-50 text-green-600",
      lastActive: "3 days ago",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@company.com",
      avatarUrl: avatar4,
      role: "Viewer",
      roleColor: "bg-emerald-50 text-emerald-700",
      status: "Invited",
      statusColor: "bg-amber-50 text-amber-700",
      lastActive: "-",
    },
    {
      id: 5,
      name: "James Thompson",
      email: "james@company.com",
      avatarUrl: avatar5,
      role: "Editor",
      roleColor: "bg-sky-50 text-sky-600",
      status: "Suspended",
      statusColor: "bg-gray-100 text-gray-700",
      lastActive: "1 week ago",
    },
  ];

  const members =
    Array.isArray(propMembers) && propMembers.length
      ? propMembers
      : defaultMembers;

  const totalMembers = members.length;
  const admins = members.filter((m) => m.role === "Admin").length;
  const pendingInvites = members.filter((m) => m.status === "Invited").length;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900 p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Team Management</h1>
          <p className="text-gray-500 text-sm">
            Manage your organization's members, roles, and permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input placeholder="Search members..." className="w-[300px]" />
          <Button className="bg-black text-white hover:bg-gray-900">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 rounded-2xl border border-gray-200 bg-white">
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Members</div>
              <div className="text-lg font-semibold mt-1">{totalMembers}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <UsersIcon className="w-5 h-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 rounded-2xl border border-gray-200 bg-blue-50">
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-700">Admins</div>
              <div className="text-lg font-semibold mt-1">{admins}</div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 rounded-2xl border border-gray-200 bg-amber-50">
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-700">Pending Invites</div>
              <div className="text-lg font-semibold mt-1">{pendingInvites}</div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card className="rounded-2xl border border-gray-200 overflow-hidden">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
              >
                {/* Member Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    {m.avatarUrl ? (
                      <AvatarImage src={m.avatarUrl} alt={m.name} />
                    ) : (
                      <AvatarFallback>{m.name[0]}</AvatarFallback>
                    )}
                  </Avatar>

                  <div>
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-sm text-gray-500">{m.email}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${m.roleColor}`}
                  >
                    {m.role}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs ${m.statusColor}`}
                  >
                    {m.status}
                  </span>

                  <div className="text-xs text-gray-500">{m.lastActive}</div>

                  <button className="p-2 rounded hover:bg-gray-100">
                    <RefreshCcw className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Info */}
      <div className="mt-6">
        <Card className="p-4 bg-amber-50 border-yellow-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-amber-100">
              <Shield className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="font-medium">Permissions Overview</div>
              <div className="text-sm text-gray-700 mt-1 leading-snug">
                Admins can manage API keys, billing, and user access. Editors
                can modify content. Viewers have read-only access.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default TeamManagementtemp;
