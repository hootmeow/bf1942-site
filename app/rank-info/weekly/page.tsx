import { redirect } from "next/navigation";

export default function WeeklyRankPage() {
    redirect("/rank-info?period=weekly");
}
