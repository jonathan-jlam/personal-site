import type { Metadata } from "next";
import EntryList from "@/components/EntryList";

export const metadata: Metadata = { title: "Coding" };

export default function CodingPage() {
  return <EntryList filter="coding" />;
}
