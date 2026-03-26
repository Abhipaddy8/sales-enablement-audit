"use client";

const LOGOS = [
  { src: "/logos/2025-03-29_14-35-18.png", alt: "Bank of America" },
  { src: "/logos/2025-03-29_14-55-05.png", alt: "Novartis" },
  { src: "/logos/2025-03-29_14-47-15.png", alt: "Caterpillar" },
  { src: "/logos/2025-03-29_14-49-44.png", alt: "Palo Alto Networks" },
  { src: "/logos/2025-03-29_14-43-04.png", alt: "Fidelity" },
  { src: "/logos/2025-03-29_15-05-26.png", alt: "Boston Scientific" },
  { src: "/logos/2025-03-29_15-09-19.png", alt: "Cigna Healthcare" },
  { src: "/logos/2025-03-29_15-03-57.png", alt: "Cargill" },
];

export default function LogoMarquee() {
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <div>
      <p className="text-center text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">
        Trusted by teams at
      </p>
      <div className="overflow-hidden">
        <div
          className="flex items-center"
          style={{ animation: "marquee 25s linear infinite", width: "max-content" }}
        >
          {doubled.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className="h-10 w-auto grayscale opacity-50 mx-8 flex-shrink-0 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
