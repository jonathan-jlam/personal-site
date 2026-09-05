import type { Metadata } from "next";
import EntryList from "@/components/EntryList";

export const metadata: Metadata = { title: "Music" };

export default function MusicPage() {
  return <EntryList filter="music" />;
}
