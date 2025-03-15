"use client";
import { useState } from "react";
import EducationLoanModal from "@/components/loans/Eductaion-loans/page";
import VehicleLoanModal from "@/components/loans/vehical-loans/page";
import PersonalLoanModal from "@/components/loans/Personal-loans/page";
import BusinessLoanModal from "@/components/loans/Business-loans/page";
import HomeLoanModal from "@/components/loans/Home-loans/page";
import GoldLoanModal from "@/components/loans/Gold-loans/page";

export default function LoanEligibility() {
  const [educationLoanOpen, setEducationLoanOpen] = useState(false);
  const [vehicleLoanOpen, setVehicleLoanOpen] = useState(false);
  const [personalLoanOpen, setPersonalLoanOpen] = useState(false);
  const [businessLoanOpen, setBusinessLoanOpen] = useState(false);
  const [homeLoanOpen, setHomeLoanOpen] = useState(false);
  const [goldLoanOpen, setGoldLoanOpen] = useState(false);

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen space-y-4">
      <button
        onClick={() => setEducationLoanOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        View Education Loan Options
      </button>
      {educationLoanOpen && (
        <EducationLoanModal isOpen={educationLoanOpen} closeModal={() => setEducationLoanOpen(false)} />
      )}

      <button
        onClick={() => setVehicleLoanOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        View Vehicle Loan Options
      </button>
      {vehicleLoanOpen && (
        <VehicleLoanModal isOpen={vehicleLoanOpen} closeModal={() => setVehicleLoanOpen(false)} />
      )}

      <button
        onClick={() => setPersonalLoanOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        View Personal Loan Options
      </button>
      {personalLoanOpen && (
        <PersonalLoanModal isOpen={personalLoanOpen} closeModal={() => setPersonalLoanOpen(false)} />
      )}

      <button
        onClick={() => setBusinessLoanOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        View Business Loan Options
      </button>
      {businessLoanOpen && (
        <BusinessLoanModal isOpen={businessLoanOpen} closeModal={() => setBusinessLoanOpen(false)} />
      )}

      <button
        onClick={() => setHomeLoanOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        View Home Loan Options
      </button>
      {homeLoanOpen && (
        <HomeLoanModal isOpen={homeLoanOpen} closeModal={() => setHomeLoanOpen(false)} />
      )}

      <button
        onClick={() => setGoldLoanOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        View Gold Loan Options
      </button>
      {goldLoanOpen && (
        <GoldLoanModal isOpen={goldLoanOpen} closeModal={() => setGoldLoanOpen(false)} />
      )}
    </div>
  );
}
