import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { getIconComponent } from "@/lib/iconMap";
import type { Service, Category } from "@shared/schema";

export default function Services() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryParam = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: services = [], isLoading: servicesLoading, isError: servicesError } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const isLoading = categoriesLoading || servicesLoading;
  const isError = categoriesError || servicesError;

  const filteredServices = services.filter((service) => {
    if (!service || !service.slug || !service.name) {
      return false;
    }

    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.summary?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      categories.find(cat => cat.id === service.categoryId)?.slug === selectedCategory;
    
    const price = parseFloat(service.basePriceInr);
    if (isNaN(price)) {
      return false;
    }

    const matchesPrice = priceRange === "all" ||
      (priceRange === "under5k" && price < 5000) ||
      (priceRange === "5k-10k" && price >= 5000 && price < 10000) ||
      (priceRange === "10k-20k" && price >= 10000 && price < 20000) ||
      (priceRange === "over20k" && price >= 20000);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">Our Services</h1>
            <p className="text-lg text-muted-foreground">
              Browse our complete catalog of business services
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger data-testid="select-price">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under5k">Under ₹5,000</SelectItem>
                  <SelectItem value="5k-10k">₹5,000 - ₹10,000</SelectItem>
                  <SelectItem value="10k-20k">₹10,000 - ₹20,000</SelectItem>
                  <SelectItem value="over20k">Over ₹20,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isError ? (
            <div className="text-center py-16">
              <p className="text-lg text-destructive mb-4">Failed to load services. Please try again later.</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                data-testid="button-reload"
              >
                Reload Page
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredServices.length} of {services.length} services
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const price = parseFloat(service.basePriceInr);
                  if (!service.slug || isNaN(price)) {
                    console.warn('Invalid service data:', service);
                    return null;
                  }
                  
                  return (
                    <ServiceCard
                      key={service.slug}
                      slug={service.slug}
                      name={service.name}
                      summary={service.summary}
                      basePriceInr={price}
                      etaDays={service.etaDays}
                      icon={getIconComponent(service.icon)}
                    />
                  );
                })}
              </div>
            </>
          )}

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No services found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
