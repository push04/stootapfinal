import Navigation from "../Navigation";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function NavigationExample() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}
