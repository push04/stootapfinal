import CategoryTile from "../CategoryTile";
import { Building2, Landmark, Globe } from "lucide-react";

export default function CategoryTileExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <CategoryTile
        slug="business-registration"
        name="Business Registration"
        icon={Building2}
        serviceCount={12}
      />
      <CategoryTile
        slug="financial-compliance"
        name="Financial Compliance"
        icon={Landmark}
        serviceCount={18}
      />
      <CategoryTile
        slug="digital-marketing"
        name="Digital Marketing"
        icon={Globe}
        serviceCount={24}
      />
    </div>
  );
}
