import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Agents</h1>
      <a href="/loan-eligibility" className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        Loan Eligibility
      </a>
      <a href="/loan-guide" className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        Loan Guide
      </a>
      <a href="/finance-advisor" className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        Finance Advisor
      </a>
    </div>
  );
}
