import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-zinc-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <Card className="border-2">
          <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              Stootap ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our platform and services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Company name and business details</li>
              <li>GST number and other tax identifiers</li>
              <li>Billing and payment information</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you use our platform, we may automatically collect:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf</li>
              <li><strong>Business Partners:</strong> Professionals who deliver the services you purchase</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information.
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access, update, or delete your personal information</li>
              <li>Object to processing of your information</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and hold
              certain information. You can instruct your browser to refuse all cookies or to indicate when
              a cookie is being sent.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites. We are not responsible for the privacy
              practices of these external sites.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect
              personal information from children.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@stootap.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: Stootap Business Services, Mumbai, India</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
