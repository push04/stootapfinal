import ServiceCard from "../ServiceCard";
import { Building2, Landmark, Globe } from "lucide-react";

export default function ServiceCardExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ServiceCard
        slug="llp-incorporation"
        name="LLP Incorporation"
        summary="Complete setup of Limited Liability Partnership with all registrations and documentation"
        basePriceInr={8999}
        etaDays={7}
        icon={Building2}
      />
      <ServiceCard
        slug="gst-registration"
        name="GST Registration"
        summary="GSTIN allotment with HSN/SAC code classification for your business"
        basePriceInr={2499}
        etaDays={3}
        icon={Landmark}
      />
      <ServiceCard
        slug="website-development"
        name="5-Page Website"
        summary="Professional website with responsive design, SEO optimization, and SSL security"
        basePriceInr={12999}
        etaDays={14}
        icon={Globe}
      />
    </div>
  );
}
