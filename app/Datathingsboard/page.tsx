
"use client";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchDistance } from "../Utils/getDistance";

const WebSocketAPIExample = () => {
  const [distance, setDistance] = useState<string | null>(null);
  const [data, setData] = useState<Array<{ name: string; distance: number }>>(
    []
  );
  const [blockageDetected, setBlockageDetected] = useState<boolean>(false);
  const threshold = 100; // Define your threshold here (e.g., 100 cm)

  useEffect(() => {
    fetchDistance((distanceValue) => {
      setDistance(distanceValue);
      const numericDistance = parseFloat(distanceValue);

      // Check if the distance is below the threshold
      if (numericDistance < threshold) {
        setBlockageDetected(true);
      } else {
        setBlockageDetected(false);
      }

      setData((prevData) => [
        ...prevData,
        {
          name: new Date().toLocaleTimeString(),
          distance: numericDistance,
        },
      ]);
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-900 text-white">
      <div className="text-center p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Drainage-system Reading</h1>
        <div className="text-xl mb-6">
          {distance ? (
            <>
              <p>
                <span className="font-semibold">Distance:</span> {distance} cm
              </p>
              {blockageDetected && (
                <p className="text-red-500 font-bold">
                  Blockage detected! Distance is below {threshold} cm.
                </p>
              )}
            </>
          ) : (
            <p>Waiting for data...</p>
          )}
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="distance" stroke="#82CA9D" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WebSocketAPIExample;

