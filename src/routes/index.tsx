import { createFileRoute } from "@tanstack/react-router";
import { SiteMagazine } from "@/components/SiteMagazine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yogya Chugh — Developer & Builder" },
      {
        name: "description",
        content:
          "Personal site of Yogya Chugh — CS undergrad shipping IDEs in Rust, browser engines in C++, ML tools, and software for real clients.",
      },
      { property: "og:title", content: "Yogya Chugh — Developer & Builder" },
      {
        property: "og:description",
        content: "Magazine-style portfolio: projects, work, writing, contact.",
      },
    ],
  }),
  component: SiteMagazine,
});
