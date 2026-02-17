import type { Metadata } from "next"
import SearchClient from "./search-client"

export const metadata: Metadata = {
  title: "Search & Browse",
  description:
    "Search for Battlefield 1942 players, browse round history, and compare player stats side-by-side.",
  openGraph: {
    title: "Search & Browse",
  },
}

export default function SearchPage() {
  return <SearchClient />
}
