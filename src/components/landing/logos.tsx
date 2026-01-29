export function Logos() {
  // Placeholder company names - in production, these would be actual logos
  const companies = [
    'Stripe',
    'Notion',
    'Vercel',
    'Linear',
    'Figma',
    'Slack',
  ];

  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Trusted by revenue teams at leading companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company) => (
            <div
              key={company}
              className="text-xl font-semibold text-muted-foreground/50 transition-colors hover:text-muted-foreground"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
