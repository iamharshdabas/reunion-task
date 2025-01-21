import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { subtitle, title } from "@/config/class-variants";
import { siteHref } from "@/config/site";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Section>
        <h1 className={title({ class: "text-balance text-center" })}>
          Conquer Your Day, One Task at a Time
        </h1>
        <h2 className={subtitle({ class: "max-w-prose text-center" })}>
          Seamlessly organize, prioritize, and crush your to-do list. Transform
          chaos into clarity and achieve your goals effortlessly.
        </h2>
        <div className="flex flex-col w-full sm:w-fit sm:flex-row gap-4">
          <Button asChild>
            <Link href={siteHref.dashboard()}>Get started for free</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
