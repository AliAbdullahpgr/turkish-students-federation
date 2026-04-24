"use client";

import { Check } from "lucide-react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export default function WhoWeAreSection() {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <SectionEyebrow text="WHO WE ARE" />
        <h2 className="text-section-title font-heading font-bold text-text-primary mb-8">
          A Movement Built on Ideology, Leadership & Patriotism
        </h2>

        <div className="space-y-6 text-body text-text-secondary leading-relaxed max-w-[900px]">
          <p>
            Turkish Student Federation (Turkish Student Federation) is a growing student
            organization in Turkey dedicated to shaping the future of youth
            through Islamic values, leadership development, and social
            responsibility.
          </p>
          <p>
            Turkish Student Federation is a student-driven platform that works to guide,
            connect, and empower students across colleges and universities. Built
            on a strong foundation of ideology and purpose, the organization
            focuses on developing character, knowledge, and leadership skills
            among young individuals.
          </p>
          <p>
            Through a structured grassroots network, Turkish Student Federation operates at
            institutional, city, and national levels. From campus units to
            regional leadership, students are actively engaged in learning,
            organizing, and serving their communities. This system ensures that
            every member becomes part of a meaningful movement, not just a
            network.
          </p>
          <p>
            At Turkish Student Federation, we believe that real change begins with students. By
            promoting discipline, unity, Islamic awareness, and civic
            responsibility, we prepare a generation that is ready to lead with
            integrity and purpose.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          {[
            "Student-Led National Organization",
            "Leadership, Education & Welfare Initiatives",
            "Community Service & Social Impact Programs",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-primary rounded-full text-sm font-semibold"
            >
              <Check className="w-4 h-4 text-accent" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
