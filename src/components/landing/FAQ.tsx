import { AccordionItem } from "@/components/ui/Accordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const faqs = [
  {
    question: "Who is Natalyx for?",
    answer:
      "Fertility clinics and the staff who coordinate surrogacy journeys inside them. Intended parents, gestational carriers, and outside professionals take part in a journey, but the clinic is the customer and the practice Natalyx is built around.",
  },
  {
    question: "What is a known-surrogate journey?",
    answer:
      "One where the intended parents already have a gestational carrier in mind, often a friend or family member, rather than being matched through an agency. There is no agency in the middle, so the coordination between the intended parents, the carrier, the clinic, and outside professionals tends to land on the clinic.",
  },
  {
    question: "Is Natalyx available now?",
    answer:
      "Not generally. We are introducing it to clinics gradually, which is what the interest form is for. Registering is a record of interest rather than an application, and it commits your clinic to nothing.",
  },
  {
    question: "Does Natalyx make clinical, legal, or eligibility decisions?",
    answer:
      "No. Natalyx does not make clinical, legal, insurance, psychological, or eligibility determinations, and it does not replace clinic staff, medical judgment, attorneys, mental-health evaluators, or any other professional. Those decisions stay with the clinic and the professionals involved; Natalyx organizes the coordination around them.",
  },
  {
    question: "Does this replace our coordinators?",
    answer:
      "No. It is built to reduce the repetitive parts of their work — chasing records, re-explaining the same steps, tracking what is still outstanding — so their time goes to the parts that need a person.",
  },
  {
    question: "Is Natalyx only for known-surrogate journeys?",
    answer:
      "That is where we are proving the product first, because the coordination burden is most concentrated there. The underlying problem of shared journey context and operational handoffs runs through assisted reproduction more broadly, and the platform is designed with that in mind.",
  },
  {
    question: "What information does the interest form ask for?",
    answer:
      "Your clinic name, your name, a work email, and a phone number. Nothing else. Please do not send patient, medical, legal, or case information through this public website.",
  },
];

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-paper py-20">
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
