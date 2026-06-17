import { AccordionItem } from "@/components/ui/Accordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const faqs = [
  {
    question: "Is Natalyx available now?",
    answer:
      "Not yet. We are opening interest registration now so we can follow up thoughtfully as access becomes available.",
  },
  {
    question: "Who can register interest?",
    answer:
      "Intended parents, people considering becoming gestational carriers, people interested in future donor pathways, and anyone still figuring out where they fit are welcome to register.",
  },
  {
    question: "What kinds of journeys is Natalyx being built for?",
    answer:
      "Natalyx is launching first with gestational surrogacy, but it is designed for the wider ART journey too, including IVF, donor conception, partner routing, structured intake, profile creation, and coordinated support.",
  },
  {
    question: "What happens after I register?",
    answer:
      "We will keep your details private and contact you as access opens and there is a relevant next step to share.",
  },
  {
    question: "Does Natalyx provide medical or legal advice?",
    answer:
      "Natalyx does not make medical, legal, insurance, psychological, or clinical eligibility decisions through this public form. The platform is being built to help people understand pathways and move toward the right professional and operational next steps with more clarity.",
  },
  {
    question: "What should I include in the form?",
    answer:
      "Share only general context that helps us understand your starting point. Please avoid medical, legal, financial, or confidential case details in the public form.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-paper py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-deep">
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="font-serif text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
            >
              Questions before you register?
            </h2>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={90}>
          <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white px-5 shadow-[0_10px_40px_rgba(31,26,20,0.04)] md:px-8">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
