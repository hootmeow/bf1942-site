import { redirect } from "next/navigation";

export default function ComparePage() {
    redirect("/search?tab=compare");
}
