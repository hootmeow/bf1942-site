import { redirect } from "next/navigation";

export default function MonthlyRankPage() {
    redirect("/rank-info?period=monthly");
}
