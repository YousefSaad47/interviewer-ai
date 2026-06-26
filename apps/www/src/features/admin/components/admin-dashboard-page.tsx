"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { adminSections } from "../data";
import type { AdminModalMode, AdminSection, DrawerContent } from "../types";
import { DetailDrawer } from "./admin-drawers";
import { AdminModal } from "./admin-modal";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import {
  AdminsSection,
  AnalyticsSection,
  CodingSection,
  InterviewsSection,
  OverviewSection,
  ResumesSection,
  UsersSection,
} from "./sections";

export function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawer, setDrawer] = useState<DrawerContent | null>(null);
  const [adminModal, setAdminModal] = useState<AdminModalMode | null>(null);
  const active = adminSections.find((section) => section.id === activeSection);

  const navigateToSection = (section: AdminSection) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 opacity-[0.22] dark:opacity-[0.18]">
        <div className="absolute top-[-12rem] left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10rem] bottom-[18rem] h-[26rem] w-[26rem] rounded-full bg-[var(--chart-2)]/15 blur-3xl" />
      </div>

      <AdminSidebar
        activeSection={activeSection}
        onNavigate={navigateToSection}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <div className="relative min-h-screen lg:pl-[280px]">
        <AdminTopbar
          title={active?.title}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {activeSection === "overview" && (
                <OverviewSection onDrawerOpen={setDrawer} />
              )}
              {activeSection === "users" && (
                <UsersSection onDrawerOpen={setDrawer} />
              )}
              {activeSection === "interviews" && (
                <InterviewsSection onDrawerOpen={setDrawer} />
              )}
              {activeSection === "coding" && (
                <CodingSection onDrawerOpen={setDrawer} />
              )}
              {activeSection === "resumes" && (
                <ResumesSection onDrawerOpen={setDrawer} />
              )}
              {activeSection === "analytics" && <AnalyticsSection />}
              {activeSection === "admins" && (
                <AdminsSection onModeChange={setAdminModal} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <DetailDrawer drawer={drawer} onClose={() => setDrawer(null)} />
      <AdminModal mode={adminModal} onClose={() => setAdminModal(null)} />
    </div>
  );
}
