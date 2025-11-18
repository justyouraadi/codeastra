import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign } from "lucide-react";
import BillingTable from "@/components/organisms/Table";
import FormCard from "@/components/organisms/FormCard";

const BillingPage = () => { 
  const cardData = [
    {
      title: "Current Plan",
      planName: "Pro Plan — ₹499/month",
      renewalDate: "Oct 25, 2025",
      status: "Active",
      description:
        "Includes unlimited chat history, advanced AI features, and team access. Manage billing and team seats from here.",
      buttons: [
        { label: "Upgrade Plan", variant: "black" },
        { label: "Cancel Subscription", variant: "outline" },
      ],
      icon: <DollarSign />,
      bgColor: "bg-white",
      textColor: "text-gray-900",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
    },
    {
      title: "Payment Method",
      description:
        "Visa ending in 2424 — Expires 08/27. Primary billing card used for renewals.",
      buttons: [
        { label: "Update Payment", variant: "black" },
        { label: "+ Add New Card", variant: "outline" },
      ],
      icon: <CreditCard />,
      bgColor: "bg-white",
      textColor: "text-gray-900",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
  ];
 
  const pricingPlans = [
    {
      plan: "Basic Plan",
      price: "₹199",
      color: "bg-yellow-50 border-yellow-100 text-yellow-700",
      features: ["AI chat support", "Basic analytics", "Email support"],
      buttonText: "Choose Plan",
    },
    {
      plan: "Pro Plan",
      price: "₹499",
      color: "bg-blue-50 border-blue-100 text-blue-700",
      features: [
        "Unlimited AI chat",
        "Advanced analytics",
        "Team access (5 users)",
      ],
      buttonText: "Current Plan",
    },
    {
      plan: "Enterprise",
      price: "₹999",
      color: "bg-purple-50 border-purple-100 text-purple-700",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Unlimited team access",
      ],
      buttonText: "Choose Plan",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6fbff] text-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-6">
         <div className="mb-10">
          <h2 className="text-2xl font-semibold">Billing & Subscription</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your current plan, payment methods, and invoice records.
          </p>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">{cardData[0].title}</h3>
              <Badge className="bg-green-100 text-green-700 text-xs font-medium">
                {cardData[0].status}
              </Badge>
            </div>

            <p className="text-base font-medium mb-1">
              {cardData[0].planName}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Renewal Date: {cardData[0].renewalDate}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {cardData[0].description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button className="bg-black text-white hover:bg-gray-800">
                Upgrade Plan
              </Button>
              <Button
                variant="outline"
                className="border border-gray-300 hover:bg-gray-50"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>

           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">{cardData[1].title}</h3>
              <div
                className={`${cardData[1].iconBg} p-2 rounded-lg ${cardData[1].iconColor}`}
              >
                {cardData[1].icon}
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              {cardData[1].description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button className="bg-black text-white hover:bg-gray-800">
                Update Payment
              </Button>
              <Button
                variant="outline"
                className="border border-gray-300 hover:bg-gray-50"
              >
                + Add New Card
              </Button>
            </div>
          </div>
        </div>

         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all mb-12 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold">Billing History</h3>
              <p className="text-sm text-gray-600 mt-1">
                Recent invoices and payment status
              </p>
            </div>
            <Badge className="bg-gray-100 text-gray-700 text-xs font-medium">
              Updated
            </Badge>
          </div>
          <BillingTable />
        </div>

         <div className="text-center mb-10">
          <h3 className="text-lg font-semibold mb-2">Choose Your Plan</h3>
          <p className="text-sm text-gray-600 mb-8">
            Upgrade or switch to a plan that fits your needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all ${plan.color}`}
              >
                <h4 className="font-medium mb-2">{plan.plan}</h4>
                <p className="text-3xl font-bold">{plan.price}</p>
                <p className="text-xs text-gray-600 mb-5">/month</p>

                <ul className="text-sm text-gray-700 mb-6 space-y-2 text-left mx-auto w-fit">
                  {plan.features.map((feature, i) => (
                    <li key={i}>✔️ {feature}</li>
                  ))}
                </ul>

                <Button className="bg-black text-white hover:bg-gray-800 w-full">
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>

         <div className="text-center text-sm text-gray-500">
          Need help with billing? Contact{" "}
          <a
            href="mailto:support@example.com"
            className="underline text-gray-700 hover:text-black"
          >
            support@example.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
