import { Switch, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Students from "@/pages/Students";
import Profile from "@/pages/Profile";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import Checkout from "@/pages/Checkout";
import StudentDashboard from "@/pages/student/Dashboard";
import BusinessDashboard from "@/pages/business/Dashboard";
import CompanyDashboard from "@/pages/CompanyDashboard";
import PostJob from "@/pages/PostJob";
import RegisterCompany from "@/pages/RegisterCompany";

import Opportunities from "@/pages/Opportunities";
import JobDetail from "@/pages/JobDetail";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import CompanyPackages from "@/pages/CompanyPackages";
import Mentorship from "@/pages/Mentorship";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/about" component={AboutUs} />
      <Route path="/contact" component={Contact} />
      <Route path="/careers" component={Careers} />
      <Route path="/students" component={Students} />
      <Route path="/opportunities" component={Opportunities} />
      <Route path="/opportunities/:slug" component={JobDetail} />
      <Route path="/services" component={Services} />
      <Route path="/services/:slug" component={ServiceDetail} />
      <Route path="/packages" component={CompanyPackages} />
      <Route path="/mentorship" component={Mentorship} />

      {/* Legal Routes */}
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/refund-policy" component={RefundPolicy} />

      {/* Protected Routes */}
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/checkout">
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      </Route>

      {/* Dashboard Routes (Role Based) */}
      <Route path="/student/dashboard">
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/candidate/dashboard">
        {/* Redirect old path or reuse component */}
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/business/dashboard">
        <ProtectedRoute>
          <BusinessDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/company/dashboard">
        <ProtectedRoute>
          <CompanyDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/company/register">
        <ProtectedRoute>
          <RegisterCompany />
        </ProtectedRoute>
      </Route>
      <Route path="/company/post-job">
        <ProtectedRoute>
          <PostJob />
        </ProtectedRoute>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        {() => {
          window.location.href = "/admin/login";
          return null;
        }}
      </Route>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
