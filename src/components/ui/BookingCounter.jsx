import React from "react";
import { Camera, Car } from "lucide-react";

const BookingCounter = ({ tourCount, transferCount }) => {
  return (
    <div className="flex justify-center gap-4 py-2">
      <div className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-xl border border-cyan-200">
        <Camera size={16} />
        <span className="text-sm font-medium">
          {tourCount} Tour{tourCount !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-xl border border-teal-200">
        <Car size={16} />
        <span className="text-sm font-medium">
          {transferCount} Transfer{transferCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default BookingCounter;
