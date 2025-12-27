import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-zinc-600 bg-clip-text text-transparent">
          Refund Policy
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <Card className="border-2">
          <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
            <h2>Our Commitment</h2>
            <p>
              At Stootap, we are committed to providing high-quality business services. This Refund Policy outlines
              the conditions under which refunds may be issued.
            </p>

            <h2>Refund Eligibility</h2>
            <h3>Services Not Yet Started</h3>
            <p>
              If we have not yet commenced work on your service order, you may request a full refund within 24 hours
              of payment. Refunds will be processed within 5-7 business days.
            </p>

            <h3>Services in Progress</h3>
            <p>
              Once work has commenced on your order:
            </p>
            <ul>
              <li>Partial refunds may be considered based on work completed</li>
              <li>Government fees paid on your behalf are non-refundable</li>
              <li>Refund amount will be calculated based on remaining deliverables</li>
            </ul>

            <h3>Completed Services</h3>
            <p>
              Services that have been fully delivered are generally not eligible for refunds. However, we may consider
              refunds in cases of:
            </p>
            <ul>
              <li>Significant errors or defects in delivered work</li>
              <li>Non-delivery of promised services</li>
              <li>Failure to meet agreed-upon specifications</li>
            </ul>

            <h2>Non-Refundable Items</h2>
            <p>The following are not eligible for refunds:</p>
            <ul>
              <li>Government fees and statutory charges</li>
              <li>Third-party professional fees already paid</li>
              <li>Services where deliverables have been accepted by the client</li>
              <li>Custom research or consulting services once delivered</li>
              <li>Domain name registrations and renewals</li>
            </ul>

            <h2>How to Request a Refund</h2>
            <p>To request a refund:</p>
            <ol>
              <li>Email us at refunds@stootap.com with your order ID</li>
              <li>Provide detailed reasons for the refund request</li>
              <li>Include any supporting documentation</li>
              <li>Our team will review your request within 2-3 business days</li>
            </ol>

            <h2>Refund Processing</h2>
            <h3>Approval Process</h3>
            <p>
              All refund requests are reviewed on a case-by-case basis. We will notify you of the approval or rejection
              of your refund within 3-5 business days.
            </p>

            <h3>Payment Method</h3>
            <p>
              Approved refunds will be processed back to the original payment method used for the purchase. Processing
              times may vary:
            </p>
            <ul>
              <li>Credit/Debit Cards: 5-10 business days</li>
              <li>UPI/Net Banking: 3-7 business days</li>
              <li>Wallet payments: 2-5 business days</li>
            </ul>

            <h2>Chargebacks</h2>
            <p>
              If you file a chargeback with your payment provider while we are processing a refund request, we may
              suspend your account pending resolution. Filing a chargeback before contacting us may result in your
              account being permanently suspended.
            </p>

            <h2>Service Modifications</h2>
            <p>
              Instead of a refund, you may be eligible for:
            </p>
            <ul>
              <li>Service modifications to meet your requirements</li>
              <li>Credit towards future services</li>
              <li>Substitution with alternative services of equal value</li>
            </ul>

            <h2>Exceptional Circumstances</h2>
            <p>
              We may offer refunds outside of this policy in cases of:
            </p>
            <ul>
              <li>Service disruptions caused by us</li>
              <li>Force majeure events preventing service delivery</li>
              <li>Technical errors in pricing or service description</li>
            </ul>

            <h2>Recurring Services</h2>
            <p>
              For subscription-based or recurring services:
            </p>
            <ul>
              <li>You may cancel at any time</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds for partial periods</li>
              <li>No refunds for unused time in the billing period</li>
            </ul>

            <h2>Dispute Resolution</h2>
            <p>
              If you disagree with our refund decision:
            </p>
            <ol>
              <li>Request escalation to our senior management team</li>
              <li>Provide additional documentation or clarification</li>
              <li>If unresolved, you may seek mediation through applicable consumer forums</li>
            </ol>

            <h2>Changes to This Policy</h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page
              with an updated revision date.
            </p>

            <h2>Contact Us</h2>
            <p>
              For refund requests or questions about this policy:
            </p>
            <ul>
              <li>Email: refunds@stootap.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Support Hours: Monday-Saturday, 10 AM - 7 PM IST</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
