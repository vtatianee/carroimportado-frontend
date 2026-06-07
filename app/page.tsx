// Server Component wrapper — injeta o JSON-LD no <head> apenas na homepage
import { JsonLd } from "./components/JsonLd";
import HomeClient from "./_HomeClient";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <HomeClient />
    </>
  );
}
