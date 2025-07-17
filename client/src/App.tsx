import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import EnhancedScrollIndicator from "@/components/EnhancedScrollIndicator";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import AboutAmyloidosis from "@/pages/AboutAmyloidosis";
import Governance from "@/pages/Governance";
import Directory from "@/pages/Directory";
import Resources from "@/pages/Resources";
import UploadResource from "@/pages/UploadResource";
import GetInvolved from "@/pages/GetInvolved";
import JoinCAS from "@/pages/JoinCAS";
import Contact from "@/pages/Contact";
import ALAmyloidosis from "@/pages/amyloidosis-types/ALAmyloidosis";
import ATTRAmyloidosis from "@/pages/amyloidosis-types/ATTRAmyloidosis";
import AAAmyloidosis from "@/pages/amyloidosis-types/AAAmyloidosis";
import ALect2Amyloidosis from "@/pages/amyloidosis-types/ALect2Amyloidosis";
import OtherAmyloidosis from "@/pages/amyloidosis-types/OtherAmyloidosis";
import CANN from "@/pages/CANN";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/about-amyloidosis" component={AboutAmyloidosis} />
      <Route path="/governance" component={Governance} />
      <Route path="/directory" component={Directory} />
      <Route path="/resources" component={Resources} />
      <Route path="/upload-resource" component={UploadResource} />
      <Route path="/get-involved" component={GetInvolved} />
      <Route path="/join" component={JoinCAS} />
      <Route path="/contact" component={Contact} />
      <Route path="/amyloidosis-types/al-light-chain-amyloidosis" component={ALAmyloidosis} />
      <Route path="/amyloidosis-types/attr-transthyretin-amyloidosis" component={ATTRAmyloidosis} />
      <Route path="/amyloidosis-types/aa-inflammatory-amyloidosis" component={AAAmyloidosis} />
      <Route path="/amyloidosis-types/alect2-amyloidosis" component={ALect2Amyloidosis} />
      <Route path="/amyloidosis-types/other-amyloidosis-types" component={OtherAmyloidosis} />
      <Route path="/cann" component={CANN} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <Header />
            <div className="pt-24">
              <Router />
            </div>
            <Footer />
            <EnhancedScrollIndicator />
          </div>
          <Toaster />
        </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
