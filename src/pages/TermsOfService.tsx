import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            By accessing and using ThrottleBoard ("the Service"), you accept and agree to be bound by the 
            terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Description of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            ThrottleBoard is a flight simulation request platform that connects users with content creators 
            for custom flight simulation content. Users can submit flight requests specifying departure/destination 
            airports, aircraft, and other preferences for potential inclusion in social media content.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>User Accounts and Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Account Creation</h3>
            <p className="text-muted-foreground">
              You must provide accurate and complete information when creating an account. You are responsible 
              for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">User Conduct</h3>
            <p className="text-muted-foreground">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Submit false, misleading, or inappropriate content</li>
              <li>Impersonate any person or entity</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Flight Request Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Submission Guidelines</h3>
            <p className="text-muted-foreground">
              When submitting flight requests, you agree that:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>All information provided is accurate and truthful</li>
              <li>Your flight details and handle may be featured in social media content</li>
              <li>Submissions do not guarantee that your flight will be created</li>
              <li>We reserve the right to decline or modify requests at our discretion</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Content Rights</h3>
            <p className="text-muted-foreground">
              By submitting a flight request, you grant us permission to use your flight details, handle, 
              and any associated information in our content creation and social media activities. You retain 
              ownership of your personal information but grant us a license to use it for the stated purposes.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Service Availability and Modifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Service Availability</h3>
            <p className="text-muted-foreground">
              We strive to maintain high availability of the Service, but we do not guarantee uninterrupted access. 
              We may experience downtime for maintenance, updates, or technical issues.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Service Modifications</h3>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue the Service at any time without notice. 
              We may also modify these Terms from time to time, and continued use constitutes acceptance of the updated Terms.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Service and its original content, features, and functionality are owned by ThrottleBoard and are 
            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. 
            You may not copy, modify, distribute, sell, or lease any part of our Service without our prior written consent.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Privacy and Data Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information 
            when you use our Service. By using our Service, you agree to the collection and use of information in accordance 
            with our Privacy Policy.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            To the fullest extent permitted by law, ThrottleBoard shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly 
            or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to 
            use the Service will cease immediately.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Governing Law</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict 
            of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver 
            of those rights.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us at: 
            <a href="mailto:legal@throttleboard.com" className="text-primary hover:underline">legal@throttleboard.com</a>
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          By using ThrottleBoard, you acknowledge that you have read and understood these Terms of Service 
          and agree to be bound by them.
        </p>
      </div>
    </div>
  );
}
