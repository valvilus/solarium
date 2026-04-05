import { DocsSidebar } from "./DocsSidebar";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex">
      <DocsSidebar />
      <main className="flex-1 w-full max-w-[900px] min-w-0 mx-auto px-6 py-12 lg:px-16 pt-[104px]">{children}</main>
    </div>
  );
}
