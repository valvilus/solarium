import { redirect } from "next/navigation";

export default function RedirectApps({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/dashboard/apps`);
}
