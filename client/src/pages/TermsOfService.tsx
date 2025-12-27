import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-zinc-600 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <Card className="border-2">
          <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing and using Stootap's platform and services, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
              from using our services.
            </p>

            <h2>Services</h2>
            <p>
              Stootap provides a platform connecting businesses with professional service providers for company registration,
              compliance, legal services, financial services, digital marketing, and other business-related services.
            </p>

            <h2>User Accounts</h2>
            <h3>Registration</h3>
            <p>
              To use certain features, you must register for an account. You agree to provide accurate, current, and
              complete information and to update your information to maintain its accuracy.
            </p>

            <h3>Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. Notify us immediately of any unauthorized use.
            </p>

            <h2>Orders and Payments</h2>
            <h3>Service Orders</h3>
            <p>
              When you place an order through our platform, you agree to pay all charges at the prices then in effect.
              We reserve the right to refuse or cancel any order for any reason.
            </p>

            <h3>Payment Terms</h3>
            <ul>
              <li>All payments are processed securely through Razorpay</li>
              <li>Prices are in Indian Rupees (INR) and include applicable GST</li>
              <li>Payment is required before service delivery begins</li>
              <li>Refunds are subject to our Refund Policy</li>
            </ul>

            <h2>Service Delivery</h2>
            <p>
              We strive to deliver services within the timelines specified for each service. Delivery times may vary
              based on government processing times, document availability, and other factors beyond our control.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on our platform, including text, graphics, logos, and software, is the property of Stootap
              or its licensors and is protected by copyright and other intellectual property laws.
            </p>

            <h2>User Responsibilities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our services for any unlawful purpose</li>
              <li>Provide false or misleading information</li>
              <li>Interfere with or disrupt our services</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to access our platform without permission</li>
            </ul>

            <h2>Disclaimers</h2>
            <p>
              Our platform and services are provided "as is" without warranties of any kind. We do not guarantee that
              our services will be uninterrupted, error-free, or completely secure.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Stootap shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of our services.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold Stootap harmless from any claims, damages, or expenses arising from your
              use of our services or violation of these terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction
              of the courts in Mumbai, India.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of our services after changes
              constitutes acceptance of the modified terms.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account and access to our services immediately, without prior notice,
              for any breach of these Terms.
            </p>

            <h2>Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@stootap.com</li>
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
