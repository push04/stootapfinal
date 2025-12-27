import LeadForm from "../LeadForm";
import { Card } from "@/components/ui/card";

export default function LeadFormExample() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card className="p-8">
        <h2 className="text-2xl font-bold font-heading mb-6">Contact Us</h2>
        <LeadForm />
      </Card>
    </div>
  );
}
