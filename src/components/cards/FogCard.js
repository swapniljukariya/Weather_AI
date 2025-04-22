import React from "react";
import { CloudFog } from "lucide-react";

const FogCard = ({ fog }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-xl shadow-md flex items-center gap-4">
      <CloudFog className="text-gray-700" size={36} />
      <div>
        <h3 className="text-lg font-semibold">Fog Visibility</h3>
        <p className="text-2xl">{fog ?? "N/A"} m</p>
      </div>
    </div>
  );
};

export default FogCard;
