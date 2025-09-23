"use client";

import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, IndianRupee, ShieldCheck } from "lucide-react";

export function FinancialServices() {
  const { t } = useLanguage();

  return (
    <section id="financial-services" className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          {t.financialServicesTitle}
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
          {t.financialServicesDescription}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark className="text-primary"/> {t.farmLoans}</CardTitle>
            <CardDescription>{t.farmLoansDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">{t.applyForLoan}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IndianRupee className="text-primary"/> {t.subsidies}</CardTitle>
            <CardDescription>{t.subsidiesDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">{t.viewSubsidies}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> {t.cropInsurance}</CardTitle>
            <CardDescription>{t.cropInsuranceDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">{t.getInsurance}</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
