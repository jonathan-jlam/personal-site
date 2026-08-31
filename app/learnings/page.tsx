import type { Metadata } from "next";
import EntryList from "@/components/EntryList";

export const metadata: Metadata = { title: "Learning" };

export default function LearningsPage() {
  return <EntryList filter="learning" />;
}
