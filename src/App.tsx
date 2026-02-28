import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SolveAI } from "./components/SolveAI";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import SubmitProblem from "./pages/SubmitProblem";
import ProblemDetail from "./pages/ProblemDetail";
import SubmitSolution from "./pages/SubmitSolution";
import Explore from "./pages/Explore";
import Settings from "./pages/Settings";
import { AdminRoute } from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Moderation from "./pages/admin/Moderation";
import Bounties from "./pages/admin/Bounties";
import Partners from "./pages/admin/Partners";
import Projects from "./pages/admin/Projects";
import ImpactDashboard from "./pages/admin/ImpactDashboard";
import Community from "./pages/Community";
import Chat from "./pages/Chat";
import PartnersPublic from "./pages/Partners";
import PartnersDashboard from "./pages/PartnersDashboard";
import ImpactCenter from "./pages/ImpactCenter";
import Launch from "./pages/Launch";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import GetInvolved from "./pages/GetInvolved";
import Team from "./pages/Team";
import { ThemeProvider } from "./components/theme-provider";
import Women from "./pages/Women&Youth";
import MVP_Validation from "./pages/MVP_Validation";
import ScrollToTop from "./components/ScrollToTop";
import BountyDetail from "./pages/BountyDetail";
import SubmitBountySolution from "./pages/SubmitBountySolution";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SolveAI />
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/team" element={<Team />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/progress" element={<Progress />} />
          <Route path="/submit-problem" element={<SubmitProblem />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/bounty/:id" element={<BountyDetail />} />

          <Route path="/submit-solution/:problemId" element={<SubmitSolution />} />
          <Route path="/submitBountySolution/:bountyId" element={<SubmitBountySolution />} />

          <Route path="/dashboard/explore" element={<Explore />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          
          {/* Community & Collaboration */}
          <Route path="/community" element={<Community />} />
          <Route path="/chat" element={<Chat />} />
          
          {/* Partners */}
          <Route path="/partners" element={<PartnersPublic />} />
          <Route path="/partners/dashboard" element={<PartnersDashboard />} />
          
          {/* Impact & Analytics */}
          <Route path="/impact-center" element={<ImpactCenter />} />
          <Route path="/launch" element={<Launch />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/moderation" element={<AdminRoute><Moderation /></AdminRoute>} />
          <Route path="/admin/bounties" element={<AdminRoute><Bounties /></AdminRoute>} />
          <Route path="/admin/partners" element={<AdminRoute><Partners /></AdminRoute>} />
          <Route path="/admin/projects" element={<AdminRoute><Projects /></AdminRoute>} />
          <Route path="/admin/impact" element={<AdminRoute><ImpactDashboard /></AdminRoute>} />
    
          {/* Programs Routes */}
           <Route path="/women" element={<Women />} />
           <Route path="/mvp_validation" element={<MVP_Validation />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
