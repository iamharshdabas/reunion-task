"use client";

import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

type Props = {
  endAt: Date;
};

export default function CountdownTimer({ endAt }: Props) {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const updateRemainingTime = () => {
      const distance = formatDistanceToNow(endAt, { addSuffix: true });
      setRemainingTime(distance.replace("in ", ""));
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60000);

    return () => clearInterval(interval);
  }, [endAt]);

  return <span>{remainingTime}</span>;
}
