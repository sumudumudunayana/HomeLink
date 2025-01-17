"use client";

import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(getFormattedTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  return <div >{time}</div>;
}

