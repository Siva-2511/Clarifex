import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { OnboardingTour } from "@/components/onboarding/Tour";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // In local dev without credentials, allow viewing demo state or redirect to login if preferred
  const user = session?.user;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <OnboardingTour isFirstLogin={(user as any)?.firstLogin ?? false} />
    </div>
  );
}
