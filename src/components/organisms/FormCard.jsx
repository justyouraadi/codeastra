import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'

const FormCard = ({ title, description, author, createdAt, icon, style, iconBg, iconColor, textColor, bgColor }) => {
  return (
    <Card
      className={`p-4 leading-1 rounded-2xl shadow-md transition-transform hover:scale-[1.03] hover:shadow-lg ${bgColor} ${textColor}`}
      style={style}
    >
      {/* 🔹 CardHeader: zero padding, larger negative margin-bottom */}
      <CardHeader className="p-0 mb-[-0.9rem]">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl shadow-2xl shadow-[#00000090] text-2xl flex items-center justify-center ${iconBg} ${iconColor}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      {/* 🔹 CardContent: zero padding */}
      <CardContent className="p-0 pb-4">
        <CardTitle className={`text-xl mb-2  font-semibold ${textColor}`}>
          {title}
        </CardTitle>
        <CardDescription className={`${textColor} mb-0 text-sm`}>
          {description}
        </CardDescription>
        <div className={`text-xs ${textColor}`}>
          By {author} | Created {createdAt}
        </div>
      </CardContent>
    </Card>
  )
}

export default FormCard