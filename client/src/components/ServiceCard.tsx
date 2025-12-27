import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, IndianRupee, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  slug: string;
  name: string;
  summary: string;
  basePriceInr: number;
  etaDays: number;
  icon: LucideIcon;
}

export default function ServiceCard({
  slug,
  name,
  summary,
  basePriceInr,
  etaDays,
  icon: Icon,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="flex flex-col transition-shadow duration-300 hover:shadow-2xl h-full"
        data-testid={`card-service-${slug}`}
      >
        <CardHeader>
          <motion.div
            className="mb-4 p-3 rounded-xl bg-orange-500/10 w-fit"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            <Icon className="h-8 w-8 text-primary" data-testid={`icon-service-${slug}`} />
          </motion.div>
          <CardTitle className="text-xl" data-testid={`text-service-name-${slug}`}>
            {name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground" data-testid={`text-service-summary-${slug}`}>
            {summary}
          </p>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-semibold" data-testid={`text-service-price-${slug}`}>
              <IndianRupee className="h-4 w-4" />
              {basePriceInr.toLocaleString("en-IN")}
            </div>
            <Badge variant="secondary" className="gap-1" data-testid={`badge-service-eta-${slug}`}>
              <Clock className="h-3 w-3" />
              {etaDays} days
            </Badge>
          </div>
          <Button asChild size="sm" data-testid={`button-view-service-${slug}`}>
            <Link href={`/services/${slug}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
