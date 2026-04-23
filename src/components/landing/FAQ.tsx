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
      "People hoping to start or grow a family, people considering helping another family, and anyone still figuring out where they fit are welcome to register.",
  },
  {
    question: "What happens after I register?",
    answer:
      "We will keep your details private and contact you when there is a useful next step to share.",
  },
  {
    question: "Does Natalyx provide medical or legal advice?",
    answer:
      "Natalyx does not provide medical, legal, insurance, psychological, or eligibility clearance directly. We can help point you toward qualified professionals whose experience fits your goals and where you are in the journey.",
  },
  {
    question: "What should I include in the form?",
    answer:
      "Share whatever feels useful for us to know at this first step. Please avoid medical, legal, financial, or confidential case details in the public form.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-[#f8f9fb] py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ec4899]">
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="text-[1.9rem] font-bold leading-tight text-navy"
            >
              Register interest with us now.
            </h2>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={90}>
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white px-5 shadow-[0_10px_40px_rgba(99,102,241,0.08)] md:px-8">
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
