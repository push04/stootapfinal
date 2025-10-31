import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryTileProps {
  slug: string;
  name: string;
  icon: LucideIcon;
  serviceCount: number;
}

export default function CategoryTile({ slug, name, icon: Icon, serviceCount }: CategoryTileProps) {
  return (
    <Link href={`/services?category=${slug}`}>
      <Card
        className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 hover:shadow-xl"
        data-testid={`card-category-${slug}`}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-4 rounded-2xl bg-primary/10">
            <Icon className="h-8 w-8 text-primary" data-testid={`icon-category-${slug}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1" data-testid={`text-category-name-${slug}`}>
              {name}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-category-count-${slug}`}>
              {serviceCount} services
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
