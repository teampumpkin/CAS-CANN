import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import EnhancedScrollIndicator from "@/components/EnhancedScrollIndicator";
import AdvancedMouseFollower from "@/components/AdvancedMouseFollower";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-900">
          <Header />
          <Router />
          <Footer />
        </div>
        <Toaster />
        <EnhancedScrollIndicator />
        <AdvancedMouseFollower />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
