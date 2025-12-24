"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { ServicesSection } from "@/components/sections/services-section"
import { SpecialtiesSection } from "@/components/sections/specialties-section"
import { FeaturedDoctorsSection } from "@/components/sections/featured-doctors-section"
import { BlogSection } from "@/components/sections/blog-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { DoctorRegistrationCTA } from "@/components/sections/doctor-registration-cta"
import { FAQSection } from "@/components/sections/faq-section"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <SpecialtiesSection />
        <FeaturedDoctorsSection />
        <BlogSection />
        <TestimonialsSection />
        <FAQSection />
        <DoctorRegistrationCTA />
      </div>
      <Footer />
    </main>
  )
}
