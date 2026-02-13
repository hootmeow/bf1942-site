import { redirect } from "next/navigation"

export default function CreatorsRedirect() {
  redirect("/community/highlights?tab=creators")
}
