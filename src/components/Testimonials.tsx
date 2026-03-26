"use client";

const TESTIMONIALS = [
  {
    quote: "We had invested heavily in CRM, content, and training — but none of it was translating into consistent execution. Within 90 days of working with Marc, we had a fully aligned buyer journey mapped to seller actions. The result was a 28% increase in win rates and a 35% reduction in sales cycle time within two quarters.",
    title: "Chief Revenue Officer",
    company: "SaaS ($80M ARR)",
    featured: true,
  },
  {
    quote: "New hire ramp time decrease by 40% and first-year quota attainment increase from 52% to 78%.",
    title: "SVP of Sales",
    company: "Healthcare Technology",
  },
  {
    quote: "Client satisfaction scores increase by 22% and project margin improve by 15%.",
    title: "Chief Operating Officer",
    company: "Professional Services",
  },
  {
    quote: "19% improvement in forecast accuracy and a 25% increase in pipeline conversion rates.",
    title: "VP of Revenue Operations",
    company: "Mid-Market B2B",
  },
  {
    quote: "30% increase in revenue per employee and significantly reducing our dependency on a few top performers.",
    title: "CEO",
    company: "Growth-Stage Multi-Location Services",
  },
];

function highlightNumbers(text: string) {
  return text.replace(/(\d+%?)/g, '<strong class="text-[#0176d3]">$1</strong>');
}

interface TestimonialsProps {
  showAll?: boolean; // true = all 5 (landing page), false = just 2 (results page)
}

export default function Testimonials({ showAll = true }: TestimonialsProps) {
  const featured = TESTIMONIALS.find((t) => t.featured);
  const rest = showAll ? TESTIMONIALS.filter((t) => !t.featured) : TESTIMONIALS.filter((t) => !t.featured).slice(0, 1);

  return (
    <div className="space-y-6">
      {/* Featured testimonial */}
      {featured && showAll && (
        <div className="bg-white rounded-2xl p-8 border-l-4 border-[#0176d3] shadow-sm">
          <svg className="w-8 h-8 text-[#0176d3]/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
          </svg>
          <p
            className="text-gray-700 text-lg leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: highlightNumbers(featured.quote) }}
          />
          <p className="text-sm font-semibold text-[#032d60]">
            — {featured.title}, {featured.company}
          </p>
        </div>
      )}

      {/* Grid */}
      <div className={`grid ${showAll ? "sm:grid-cols-2" : "sm:grid-cols-2"} gap-4`}>
        {rest.map((t, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border-l-4 border-[#0176d3] shadow-sm">
            <p
              className="text-gray-700 italic leading-relaxed mb-3"
              dangerouslySetInnerHTML={{ __html: `&ldquo;${highlightNumbers(t.quote)}&rdquo;` }}
            />
            <p className="text-sm font-semibold text-[#032d60]">
              — {t.title}, {t.company}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
