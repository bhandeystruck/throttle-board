import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Account Information</h3>
            <p className="text-muted-foreground">
              When you create an account, we collect your email address and any display name you provide. 
              Your password is securely hashed and stored using industry-standard encryption.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Flight Request Data</h3>
            <p className="text-muted-foreground">
              We collect flight request details including departure/destination airports, airline preferences, 
              and any notes you provide. This information is used to fulfill your flight simulation requests.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Usage Analytics</h3>
            <p className="text-muted-foreground">
              We collect anonymous usage data to improve our service, including page views, feature usage, 
              and performance metrics. This data cannot be used to identify you personally.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>To provide and maintain our flight request service</li>
            <li>To communicate with you about your flight requests and account</li>
            <li>To improve our service and develop new features</li>
            <li>To ensure the security and integrity of our platform</li>
            <li>To comply with legal obligations</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Data Storage and Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Data Storage</h3>
            <p className="text-muted-foreground">
              Your data is stored securely using Supabase, which provides enterprise-grade security 
              including encryption at rest and in transit. Data is stored in secure data centers 
              with appropriate physical and technical safeguards.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Data Retention</h3>
            <p className="text-muted-foreground">
              We retain your account data for as long as your account is active. Flight request data 
              is retained to maintain service history and may be archived after 2 years of inactivity. 
              You can request data deletion at any time.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Under applicable data protection laws, you have the following rights:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Restriction:</strong> Limit how we process your data</li>
            <li><strong>Objection:</strong> Object to certain types of data processing</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Cookies and Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We use essential cookies to maintain your session and provide core functionality. 
            We do not use third-party tracking cookies or advertising cookies. You can manage 
            cookie preferences in your browser settings.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We use Supabase for authentication and database services. Please review their 
            privacy policy for information about how they handle your data. We do not sell 
            or share your personal information with third parties for marketing purposes.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy or want to exercise your rights, 
            please contact us at: <a href="mailto:privacy@throttleboard.com" className="text-primary hover:underline">privacy@throttleboard.com</a>
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          This privacy policy may be updated from time to time. We will notify users of any 
          material changes by posting the new policy on this page and updating the "Last updated" date.
        </p>
      </div>
    </div>
  );
}
