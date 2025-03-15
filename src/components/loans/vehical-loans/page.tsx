"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const banks = [
    {
        name: "Axis Bank",
        logo: "/images/axis.png",
        interest: "8.0% - 10.5%",
        duration: "10 years",
        amount: "Up to ₹30L",
        details: "Flexible repayment options | Quick approval process | No hidden charges."
    },
  {
    name: "HDFC Bank",
    logo: "/images/hdfc.png",
    interest: "7.5% - 9.0%",
    duration: "15 years",
    amount: "Up to ₹50L",
    details: "Loan up to ₹50L | Tenure up to 15 years | Quick approval process."
  },
  {
    name: "ICICI Bank",
    logo: "/images/icici.png",
    interest: "7.2% - 9.8%",
    duration: "12 years",
    amount: "Up to ₹35L",
    details: "Easy processing | Lower EMI options | Student-friendly repayment structure."
  },
  {
    name: "SBI Bank",
    logo: "/images/sbi.png",
    interest: "6.9% - 8.5%",
    duration: "20 years",
    amount: "Up to ₹40L",
    details: "Low interest rates | No prepayment charges | Government subsidies available."
  },
  {
    name: "Punjab National Bank",
    logo: "/images/punjab.png",
    interest: "7.0% - 8.9%",
    duration: "18 years",
    amount: "Up to ₹45L",
    details: "Zero processing fee | Longer repayment tenure | Collateral-free for select applicants."
  },
  {
    name: "Bank of Baroda",
    logo: "/images/baroda.png",
    interest: "6.5% - 8.2%",
    duration: "15 years",
    amount: "Up to ₹25L",
    details: "Low processing fees | Education loan insurance | Moratorium period available."
  }
];

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

type LoanDetailsProps = {
  bank: (typeof banks)[0] | null;
  isOpen: boolean;
  closeModal: () => void;
};

function LoanDetailsModal({ bank, isOpen, closeModal }: LoanDetailsProps) {
  if (!bank) return null;
  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 flex items-center justify-center z-50 bg-blue-10 bg-opacity-70 backdrop-blur-md transition-opacity">
      <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-lg w-full relative border-t-4 border-blue-400">
        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900" onClick={closeModal}>
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">{bank.name} - Loan Details</h2>
        <img src={bank.logo} alt={bank.name} className="w-16 h-16 mx-auto mb-4 rounded-full" />
        <p className="text-sm text-gray-700 font-medium">Interest Rate: {bank.interest}</p>
        <p className="text-sm text-gray-700 font-medium">Duration: {bank.duration}</p>
        <p className="text-sm text-gray-700 font-medium">Loan Amount: {bank.amount}</p>
        <p className="text-xs text-gray-500 mt-2">{bank.details}</p>
      </div>
    </Dialog>
  );
}

export default function VehicalLoanModal({ isOpen = false, closeModal }: ModalProps) {
  const [selectedBank, setSelectedBank] = useState<(typeof banks)[0] | null>(null);

  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 flex items-center justify-center z-50 bg-blue-10 bg-opacity-70 backdrop-blur-md transition-opacity">
      <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-2xl w-full relative border-t-4 border-blue-400">
        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900" onClick={closeModal}>
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Vehical Loan Options</h2>
        <div className="grid grid-cols-2 gap-4">
          {banks.slice(0, 6).map((bank, index) => (
            <div key={index} onClick={() => setSelectedBank(bank)} className="cursor-pointer flex flex-col items-center justify-center p-2 bg-blue-50 rounded-lg shadow-md border border-blue-200 hover:bg-blue-100">
              <img src={bank.logo} alt={bank.name} className="w-15 h-15 object-contain rounded-full" />
              <h3 className="text-lg font-medium text-gray-800 mt-2">{bank.name}</h3>
              <p className="text-sm text-gray-600">{bank.interest}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" onClick={() => alert('Show More Banks Logic Here')}>View More</button>
      </div>
      <LoanDetailsModal bank={selectedBank} isOpen={selectedBank !== null} closeModal={() => setSelectedBank(null)} />
    </Dialog>
  );
}
