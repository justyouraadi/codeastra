import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../ui/table";

const FormTable = ({
  title,
  caption,
  columns = [],
  data = [],
  bgColor = "bg-white",
  textColor = "text-gray-900",
  headerBg = "bg-gray-100",
  headerTextColor = "text-gray-700",
  hoverColor = "hover:bg-gray-50",
  borderColor = "border-gray-200",
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl shadow-md p-4 transition-transform hover:scale-[1.02] hover:shadow-lg ${bgColor} ${textColor} ${className}`}
    >
      {/* Title */}
      {title && (
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{title}</h2>
      )}

      {/* Table */}
      <Table className={`w-full border ${borderColor}`}>
        {/* Header */}
        <TableHeader className={`${headerBg}`}>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead
                key={i}
                className={`px-4 py-2 font-semibold ${headerTextColor}`}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={`${hoverColor} border-b ${borderColor}`}
              >
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className="px-4 py-2">
                    {row[col] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {/* Caption */}
        {caption && <TableCaption>{caption}</TableCaption>}
      </Table>
    </div>
  );
};

export default FormTable;
