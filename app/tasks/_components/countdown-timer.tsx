"use client";

import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";

type Props = {
  finished: boolean;
  startAt: Date;
  endAt: Date;
};

export default function CountdownTimer({ finished, startAt, endAt }: Props) {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const updateRemainingTime = () => {
      const distance = formatDistance(endAt, finished ? startAt : new Date(), {
        addSuffix: true,
      });
      setRemainingTime(distance);
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60000);

    return () => clearInterval(interval);
  }, [endAt, startAt, finished]);

  return <span>{remainingTime}</span>;
}
