import { notFound } from 'next/navigation';
import PersonalLoanUI from '@/components/LoanGuide/PersonalLoan/PersonalLoanUI';
import BusinessLoanUI from '@/components/LoanGuide/BusinessLoan/BusinessLoanUI';
import EducationLoanUI from '@/components/LoanGuide/EducationLoan/EducationLoanUI';

interface PageProps {
  params: { loanType: string }
  searchParams: { lang?: string }
}

export default async function LoanTypePage({ params, searchParams }: PageProps) {
  const { loanType } = await params;
  const { lang } = await searchParams;
  
  // Validate language and set default to 'en' if not provided
  const language = lang || 'en';

  if (!['personal', 'business', 'education'].includes(loanType.toLowerCase())) {
    return notFound();
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan Guide
      </h1>
      {loanType === 'personal' ? (
        <PersonalLoanUI language={language} />
      ) : loanType === 'business' ? (
        <BusinessLoanUI language={language} />
      ) : (
        <EducationLoanUI language={language} />
      )}
    </div>
  );
} 