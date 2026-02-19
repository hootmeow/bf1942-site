import type { Metadata } from "next";
import DigestClient from "./digest-client";

export async function generateMetadata(
  { params }: { params: { week: string } }
): Promise<Metadata> {
  return {
    title: `Weekly Sitrep #${params.week}`,
    description: `Battlefield 1942 weekly stats digest — Sitrep #${params.week}`,
  };
}

export default function WeeklySitrepPage() {
  return <DigestClient />;
}
