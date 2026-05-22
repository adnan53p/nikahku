import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { TrustedSection } from '@/components/landing/TrustedSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { TemplatePreview } from '@/components/landing/TemplatePreview'
import { PricingSection } from '@/components/landing/PricingSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ivory overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TrustedSection />
      <FeaturesSection />
      <TemplatePreview />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
