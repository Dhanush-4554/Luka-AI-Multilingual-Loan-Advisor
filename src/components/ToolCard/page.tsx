"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  delay?: number;
}

const ToolCard = ({ title, description, icon: Icon, path, delay = 0 }: ToolCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && cardRef.current) {
            setTimeout(() => {
              if (cardRef.current) {
                cardRef.current.classList.remove("opacity-0", "translate-y-4");
                cardRef.current.classList.add("opacity-100", "translate-y-0");
              }
            }, delay * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <Link href={path} className="block h-full">
      <Card 
        ref={cardRef} 
        className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden border border-white-200 h-full transition-all duration-300 hover:translate-y-[-5px] opacity-0 translate-y-4"
      >
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <div className="bg-blue-200 p-3 rounded-md text-finance-700">
            <Icon size={24} />
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
