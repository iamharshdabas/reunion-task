import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { title } from "@/config/class-variants";
import { siteHref } from "@/config/site";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (userId) redirect(siteHref.dashboard());

  return (
    <>
      <Section>
        <h1
          className={title({ size: "lg", class: "text-balance text-center" })}
        >
          Conquer Your Day, One Task at a Time
        </h1>
        <h2 className={title({ size: "sm", class: "max-w-prose text-center" })}>
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
