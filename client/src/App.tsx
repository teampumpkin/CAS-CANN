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
import About from "@/pages/About";
import AboutAmyloidosis from "@/pages/AboutAmyloidosis";
import Directory from "@/pages/Directory";
import Resources from "@/pages/Resources";
import UploadResource from "@/pages/UploadResource";
import GetInvolved from "@/pages/GetInvolved";
import ALAmyloidosis from "@/pages/amyloidosis-types/ALAmyloidosis";
import ATTRAmyloidosis from "@/pages/amyloidosis-types/ATTRAmyloidosis";
import AAAmyloidosis from "@/pages/amyloidosis-types/AAAmyloidosis";
import ALect2Amyloidosis from "@/pages/amyloidosis-types/ALect2Amyloidosis";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/about-amyloidosis" component={AboutAmyloidosis} />
      <Route path="/directory" component={Directory} />
      <Route path="/resources" component={Resources} />
      <Route path="/upload-resource" component={UploadResource} />
      <Route path="/get-involved" component={GetInvolved} />
      <Route path="/amyloidosis-types/al-light-chain-amyloidosis" component={ALAmyloidosis} />
      <Route path="/amyloidosis-types/attr-transthyretin-amyloidosis" component={ATTRAmyloidosis} />
      <Route path="/amyloidosis-types/aa-inflammatory-amyloidosis" component={AAAmyloidosis} />
      <Route path="/amyloidosis-types/alect2-amyloidosis" component={ALect2Amyloidosis} />
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
          <div className="pt-24">
            <Router />
          </div>
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
