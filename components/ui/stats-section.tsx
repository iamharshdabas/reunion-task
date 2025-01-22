import { title } from "@/config/class-variants";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  data: { item: string; value: string }[];
  component?: ReactNode;
};

function Stats({ data, component }: Props) {
  return (
    <div
      className={cn(
        "grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-8",
        component && "sm:grid-cols-4",
      )}
    >
      {component ? (
        <>
          <div className="col-span-2 gap-4 lg:gap-8 grid grid-rows-2">
            {data.map((item) => (
              <div
                key={item.item}
                className="flex flex-col justify-between p-6 border rounded-md"
              >
                <h2 className={title()}>{item.value}</h2>
                <p className={title({ size: "xs" })}>{item.item}</p>
              </div>
            ))}
          </div>
          <div className="col-span-2">{component}</div>
        </>
      ) : (
        data.map((item) => (
          <div
            key={item.item}
            className="flex flex-col justify-between p-6 border rounded-md"
          >
            <h2 className={title()}>{item.value}</h2>
            <p className={title({ size: "xs" })}>{item.item}</p>
          </div>
        ))
      )}
    </div>
  );
}

export { Stats };
