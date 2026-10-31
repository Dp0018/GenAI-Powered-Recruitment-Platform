import { CompanyDetailView } from "@/features/companies/components/company-detail-view";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  return <CompanyDetailView slug={slug} />;
}
