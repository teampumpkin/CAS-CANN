import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import EnhancedScrollIndicator from "@/components/EnhancedScrollIndicator";

import PerformanceOptimizer from "@/components/PerformanceOptimizer";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load components for better performance
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const AboutAmyloidosis = lazy(() => import("@/pages/AboutAmyloidosis"));
const Governance = lazy(() => import("@/pages/Governance"));
const Directory = lazy(() => import("@/pages/Directory"));
const Resources = lazy(() => import("@/pages/Resources"));
const UploadResource = lazy(() => import("@/pages/UploadResource"));
const GetInvolved = lazy(() => import("@/pages/GetInvolved"));
const JoinCAS = lazy(() => import("@/pages/JoinCAS"));
const Contact = lazy(() => import("@/pages/Contact"));
const ALAmyloidosis = lazy(
  () => import("@/pages/amyloidosis-types/ALAmyloidosis"),
);
const ATTRAmyloidosis = lazy(
  () => import("@/pages/amyloidosis-types/ATTRAmyloidosis"),
);
const AAAmyloidosis = lazy(
  () => import("@/pages/amyloidosis-types/AAAmyloidosis"),
);
const ALect2Amyloidosis = lazy(
  () => import("@/pages/amyloidosis-types/ALect2Amyloidosis"),
);
const OtherAmyloidosis = lazy(
  () => import("@/pages/amyloidosis-types/OtherAmyloidosis"),
);
const AboutCANN = lazy(() => import("@/pages/AboutCANN"));
const CANNResources = lazy(() => import("@/pages/CANNResources"));
const JournalClub = lazy(() => import("@/pages/JournalClub"));

const AccessibilityStatement = lazy(
  () => import("@/pages/AccessibilityStatement"),
);
const ContributorPortal = lazy(() => import("@/pages/ContributorPortal"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Partnerships = lazy(() => import("@/pages/Partnerships"));

const Community = lazy(() => import("@/pages/Community"));
const Events = lazy(() => import("@/pages/Events"));
const TestForms = lazy(() => import("@/pages/TestForms"));
const CANNMembershipForm = lazy(() => import("@/pages/CANNMembershipForm"));
const DataSyncAdmin = lazy(() => import("@/pages/DataSyncAdmin"));
const CommandDashboard = lazy(() => import("@/pages/CommandDashboard"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#00AFE6] mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/about-amyloidosis" component={AboutAmyloidosis} />
        <Route path="/governance" component={Governance} />
        <Route path="/directory" component={Directory} />
        {/* <Route path="/resource-library" component={Resources} /> */}
        <Route path="/partnerships" component={Partnerships} />

        <Route path="/upload-resource" component={UploadResource} />
        <Route path="/community" component={Community} />
        <Route path="/events" component={Events} />
        <Route path="/get-involved" component={GetInvolved} />
        <Route path="/join" component={JoinCAS} />
        <Route path="/join-cas" component={JoinCAS} />
        <Route path="/contact" component={Contact} />
        <Route
          path="/amyloidosis-types/al-light-chain-amyloidosis"
          component={ALAmyloidosis}
        />
        <Route
          path="/amyloidosis-types/attr-transthyretin-amyloidosis"
          component={ATTRAmyloidosis}
        />
        <Route
          path="/amyloidosis-types/aa-inflammatory-amyloidosis"
          component={AAAmyloidosis}
        />
        <Route
          path="/amyloidosis-types/alect2-amyloidosis"
          component={ALect2Amyloidosis}
        />
        <Route
          path="/amyloidosis-types/other-amyloidosis-types"
          component={OtherAmyloidosis}
        />
        <Route path="/about-cann" component={AboutCANN} />
        <Route path="/cann" component={AboutCANN} />
        <Route path="/cann_page" component={AboutCANN} />
        <Route path="/cann/resources" component={CANNResources} />
        <Route path="/cann-resources" component={CANNResources} />
        <Route path="/journal-club" component={JournalClub} />
        <Route path="/accessibility" component={AccessibilityStatement} />
        <Route path="/contributor-portal" component={ContributorPortal} />
        <Route path="/test-forms" component={TestForms} />
        <Route path="/join-cann" component={JoinCAS} />
        <Route path="/join-cann-today" component={JoinCAS} />
        <Route path="/cann-membership" component={JoinCAS} />
        <Route path="/admin/data-sync" component={DataSyncAdmin} />
        <Route path="/admin/automation" component={CommandDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              {/* Skip Links for Screen Readers */}
              <a
                href="#main-content"
                className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-[#00AFE6] focus:text-white focus:px-4 focus:py-2 focus:z-50 focus:rounded-br-lg"
              >
                Skip to main content
              </a>
              <a
                href="#navigation"
                className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-32 focus:bg-[#00AFE6] focus:text-white focus:px-4 focus:py-2 focus:z-50 focus:rounded-br-lg"
              >
                Skip to navigation
              </a>

              <Header />
              <main id="main-content" className="pt-24">
                <Router />
              </main>
              <Footer />
              <EnhancedScrollIndicator />
              <PerformanceOptimizer />
            </div>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
