import { useState, useRef } from "react";

const useFetchTemperature = () => {
  const [temperature, setTemperature] = useState(null);
  const temperatureCache = useRef({});

  const fetchTemperature = async (lat, lon) => {
    const cacheKey = `${lat},${lon}`;
    if (temperatureCache.current[cacheKey]) {
      setTemperature(temperatureCache.current[cacheKey]);
      return;
    }
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const temperatureValue = Math.round(data.main.temp);
      temperatureCache.current[cacheKey] = temperatureValue;
      setTemperature(temperatureValue);
    } catch (error) {
      console.error("Error fetching temperature:", error);
    }
  };

  return { temperature, fetchTemperature };
};

export default useFetchTemperature;
