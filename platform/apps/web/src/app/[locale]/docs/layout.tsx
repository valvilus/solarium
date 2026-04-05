import { DocsLayout as InternalDocsLayout } from "@/components/docs/layout/DocsLayout";
import { Header } from "@/components/layout/header";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <InternalDocsLayout>{children}</InternalDocsLayout>
    </>
  );
}
