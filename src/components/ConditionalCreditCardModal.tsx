
"use client";

import { usePathname } from "next/navigation";
import CreditCardConsolidationModal from "@/components/CreditCardConsolidationModal";

const hiddenPaths = [
  "/crm",
  "/crm/entry",
  "/dashboard",
  "/lead",
  "/login",
  "/register-form",
  "/privacy-policy",
  "/register",
];

export default function ConditionalCreditCardModal() {
  const pathname = usePathname();

  const shouldHide = hiddenPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (shouldHide) {
    return null;
  }

  return <CreditCardConsolidationModal />;
}