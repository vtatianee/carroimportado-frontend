import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade do carroimportado.com — como coletamos e tratamos seus dados conforme a LGPD (Lei 13.709/2018).",
  alternates: {
    canonical: "https://www.carroimportado.com/privacy",
  },
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
