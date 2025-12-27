import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryTileProps {
  slug: string;
  name: string;
  icon: LucideIcon;
  serviceCount: number;
  index?: number;
}

export default function CategoryTile({ slug, name, icon: Icon, serviceCount, index = 0 }: CategoryTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Link href={`/services?category=${slug}`}>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            className="p-6 cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
            data-testid={`card-category-${slug}`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <motion.div
                className="p-4 rounded-2xl bg-orange-500/10"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Icon className="h-8 w-8 text-primary" data-testid={`icon-category-${slug}`} />
              </motion.div>
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
        </motion.div>
      </Link>
    </motion.div>
  );
}
