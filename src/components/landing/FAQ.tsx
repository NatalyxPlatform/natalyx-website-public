import { AccordionItem } from "@/components/ui/Accordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const faqs = [
  {
    question: "Who is Natalyx for?",
    answer:
      "Fertility clinics and the staff who coordinate surrogacy journeys inside them. Intended parents, gestational carriers, and outside professionals take part in a journey, but the clinic is the customer and the practice Natalyx is built around.",
  },
  {
    question: "Which surrogacy journeys does Natalyx support?",
    answer:
      "All of the ones your clinic runs. The relay Natalyx automates — preparation, appointments, records, handoffs, and follow-through — is much the same whether the intended parents arrived with a carrier they already know, were referred through an agency, or came by another path your clinic approves. Natalyx takes over from the point the journey becomes the clinic's to run.",
  },
  {
    question: "Does Natalyx match, recruit, or supply gestational carriers?",
    answer:
      "No. Natalyx does not source, screen, rank, or match carriers, and it is not a consumer surrogacy marketplace. How a carrier comes to be part of a journey is decided outside Natalyx — by the intended parents, the clinic, and whichever professionals they involve.",
  },
  {
    question: "Does this mean we stop referring patients to an agency?",
    answer:
      "That is what it is built to make possible. The reason referring out has been the practical choice is that running the coordination in-house meant absorbing the manual relay an agency works through by hand. Automating that relay is what makes keeping the journey in the practice realistic — the decision to do so, and when, stays entirely the clinic's.",
  },
  {
    question: "Does Natalyx work with the systems our clinic already runs?",
    answer:
      "That is the intent. Natalyx is designed to fit into clinic operations rather than replace them, and to connect with existing clinic systems as integrations are enabled. It is not a replacement for your EHR. We are not claiming a completed connection to any particular system today.",
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
      "No. What gets automated is the relay itself — chasing records, re-explaining the same steps, tracking what is still outstanding — not the people. Coordinators keep the judgment calls and the conversations, and stop spending their day on the parts a system can carry.",
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
              className="text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
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
