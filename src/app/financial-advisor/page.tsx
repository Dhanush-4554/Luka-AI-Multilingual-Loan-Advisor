import ChatInterface from '@/components/FinancialAdvisorChat/ChatInterface'
import React from 'react'

export default function FinancialAdvisorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area that takes full height minus header/footer */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto">
        <div className="h-full">
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}