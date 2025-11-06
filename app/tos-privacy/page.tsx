import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TosPrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Terms of Service & Privacy Policy
        </h1>
        <p className="mt-1 text-muted-foreground">
          Legal and privacy information for bf1942.online.
        </p>
      </div>
      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Terms of Service content is not yet available.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-background">
        <CardHeader>
          <CardTitle>Privacy Policy & Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This site uses cookies and other online tracking technologies (“Cookies”) to help the site
            function, improve your experience, analyze usage, and enable targeted advertising that may
            appear on other sites or platforms.
          </p>
          <br />
          <p className="text-sm text-muted-foreground">
            By visiting our site, you consent to the use of Cookies, including the recording and
            sharing of your activity (such as game browsing, video viewing, and purchases) with
            third-party partners for targeted advertising and functional purposes, like analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}