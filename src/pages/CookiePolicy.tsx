import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What Are Cookies?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and to provide information to website owners.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How We Use Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            ThrottleBoard uses cookies to provide essential functionality and improve your experience. 
            We do not use cookies for advertising or tracking purposes.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Types of Cookies We Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">Essential Cookies</h3>
              <Badge variant="secondary">Required</Badge>
            </div>
            <p className="text-muted-foreground mb-2">
              These cookies are necessary for the website to function properly. They cannot be disabled.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Session Cookies:</strong> Maintain your login session and user preferences</li>
              <li><strong>Security Cookies:</strong> Protect against cross-site request forgery (CSRF) attacks</li>
              <li><strong>Authentication Cookies:</strong> Keep you logged in securely</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">Functional Cookies</h3>
              <Badge variant="outline">Optional</Badge>
            </div>
            <p className="text-muted-foreground mb-2">
              These cookies enhance your experience but are not essential for basic functionality.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Preference Cookies:</strong> Remember your display preferences (theme, language)</li>
              <li><strong>Form Data:</strong> Temporarily store form data to prevent loss during navigation</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">Analytics Cookies</h3>
              <Badge variant="outline">Optional</Badge>
            </div>
            <p className="text-muted-foreground mb-2">
              These cookies help us understand how visitors use our website (if enabled).
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Usage Analytics:</strong> Anonymous data about page views and feature usage</li>
              <li><strong>Performance Monitoring:</strong> Technical data to improve website speed and reliability</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Third-Party Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We use Supabase for authentication and database services. Supabase may set their own cookies 
            to provide these services securely. Please refer to Supabase's cookie policy for more information.
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">No Advertising Cookies</h4>
            <p className="text-sm text-muted-foreground">
              We do not use third-party advertising cookies or tracking pixels. We do not share your data 
              with advertising networks or social media platforms for advertising purposes.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Managing Your Cookie Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Browser Settings</h3>
            <p className="text-muted-foreground mb-2">
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>View and delete existing cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Set preferences for specific websites</li>
              <li>Receive notifications when cookies are set</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-yellow-800">Important Note</h4>
            <p className="text-sm text-yellow-700">
              Disabling essential cookies may prevent you from using certain features of our website, 
              including logging in and submitting flight requests.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Cookie Retention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">How Long Cookies Last</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Authentication Cookies:</strong> Typically expire after 30 days of inactivity</li>
              <li><strong>Preference Cookies:</strong> May persist for up to 1 year</li>
              <li><strong>Analytics Cookies:</strong> Usually expire after 2 years</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Updates to This Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We may update this Cookie Policy from time to time to reflect changes in our practices or 
            for other operational, legal, or regulatory reasons. We will notify users of any material 
            changes by posting the updated policy on this page.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If you have any questions about our use of cookies, please contact us at: 
            <a href="mailto:privacy@throttleboard.com" className="text-primary hover:underline">privacy@throttleboard.com</a>
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          By continuing to use ThrottleBoard, you consent to our use of cookies as described in this policy.
        </p>
      </div>
    </div>
  );
}
