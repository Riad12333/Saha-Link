"use client"

import { useLanguage } from "@/providers/language-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const { t } = useLanguage()

  const faqs = [
    {
      id: "1",
      question: "Comment puis-je m'inscrire sur la plateforme ?",
      answer: "L'inscription est très simple ! Cliquez sur le bouton d'inscription et entrez votre email, mot de passe et vos informations personnelles.",
    },
    {
      id: "2",
      question: "Vos consultations sont-elles sécurisées et confidentielles ?",
      answer: "Oui, toutes les données des patients sont protégées par les plus hauts niveaux de sécurité et de cryptage. Nous respectons les lois sur la protection des données médicales.",
    },
    {
      id: "3",
      question: "Combien coûte une consultation médicale ?",
      answer: "Les prix varient selon la spécialité et l'expérience du médecin. Vous pouvez voir le prix avant de réserver le rendez-vous.",
    },
    {
      id: "4",
      question: "Puis-je réserver un rendez-vous en clinique ou seulement une consultation en ligne ?",
      answer: "Nous offrons les deux options - consultations en ligne et rendez-vous en clinique selon la disponibilité du médecin.",
    },
  ]

  return (
    <section className="w-full py-20 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("faq.title")}</h2>
            <p className="text-muted-foreground">{t("faq.subtitle")}</p>
          </div>

          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-right hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-right text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
