import {
  Navbar,
  Hero,
  Logos,
  Problem,
  Features,
  Integrations,
  Testimonials,
  Pricing,
  CTA,
  Footer,
} from '@/components/landing';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Logos />
      <Problem />
      <Features />
      <Integrations />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
