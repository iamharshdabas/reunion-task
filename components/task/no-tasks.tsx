import { title } from "@/config/class-variants";
import { siteHref } from "@/config/site";
import Link from "next/link";
import Section from "../layout/section";
import { Button } from "../ui/button";

export default function NoTasks() {
  return (
    <Section minHeightScreen={false}>
      <h1 className={title()}>You have no tasks</h1>
      <h2 className={title({ size: "sm" })}>Get started by creating a task</h2>
      <Button asChild>
        <Link href={siteHref.taskNew()}>Add Product</Link>
      </Button>
    </Section>
  );
}
