import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

const FormCard = ({
  title,
  description,
  author,
  createdAt,
  icon,
  style,
  iconBg,
  iconColor,
  textColor,
  bgColor,
}) => {

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return "just now";
  };

  return (
    <Card
      className={`p-4 leading-1 rounded-2xl shadow-md transition-transform hover:scale-[1.03] hover:shadow-lg ${bgColor} ${textColor}`}
      style={style}
    >
      {/* 🔹 CardHeader: zero padding, larger negative margin-bottom */}
      <CardHeader className="p-0 mb-[-0.9rem]">
        <div className="flex items-center">
          <div
            className={`p-3 rounded-xl shadow-2xl shadow-[#00000090] text-2xl flex items-center justify-center ${iconColor}`}
            style={{ background: iconBg }}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
      {/* 🔹 CardContent: zero padding */}
      <CardContent className="p-0">
        <CardTitle className={`text-xl mb-2  font-semibold text-[#1F2937]`}>
          {title}
        </CardTitle>
        <CardDescription
          className={`text-[#4B5563] mb-0 text-sm line-clamp-3`}
          title={description}
        >
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className={"p-0"}>
        <div className={`text-xs text-[#6B7280]`}>Created  {getTimeAgo(createdAt)}</div>
      </CardFooter>
    </Card>
  );
};

export default FormCard;
