import { redirect } from "next/navigation";

export default function RoundsPage() {
    redirect("/search?tab=rounds");
}
