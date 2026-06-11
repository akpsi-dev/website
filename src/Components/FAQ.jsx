import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./FAQ.css";

const faqData = [
  {
    question: "What is Rush?",
    answer: `Rush is a two-week series of events where potential members can learn about Alpha Kappa Psi's values, activities, and members. Events focus on professional development, leadership, and networking. After interviews, selected individuals are invited to join.`,
  },
  {
    question: "What sets Alpha Kappa Psi apart from other organizations?",
    answer: `AKPsi is the only business fraternity at UCI with a national reach that is open to all majors. You can learn about a vastly different field from each member, and that's what is special about us.`,
  },
  {
    question: "What majors does Alpha Kappa Psi accept?",
    answer: `Alpha Kappa Psi is open to students from all majors who have an interest in business, leadership, and personal development. We believe in diversity and the different perspectives that various disciplines bring to the table.`,
  },
  {
    question: "What is pledging?",
    answer: `Pledging is a professional development program where new members engage in a variety of activities designed to enhance their leadership, teamwork, and professional skills. It's a time for members to bond with each other while developing essential career skills.`,
  },
  {
    question:
      "Can I rush again if I do not get an invitation to pledge the first time?",
    answer: `Absolutely! If you didn't receive an invitation, you're encouraged to re-Rush in a future quarter (Fall or Spring). We value growth greatly, and would love to speak with you again.`,
  },
  {
    question:
      "What criteria is used when deciding whom is given an invitation to pledge?",
    answer: `We evaluate candidates on leadership potential, teamwork skills, professionalism, and their commitment to personal growth. We also consider social compatibility and how well candidates align with our organization's values.`,
  },
  {
    question: "How many pledges are accepted each quarter?",
    answer: `The number of accepted pledges can vary each quarter and is never a set number.`,
  },
  {
    question:
      "Can I pledge for Alpha Kappa Psi if I am a member of a social fraternity or sorority?",
    answer: `Yes, you can be a member of Alpha Kappa Psi and a social fraternity or sorority, but you cannot join if you are already part of another professional fraternity.`,
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <div className="faq__heading hairline-bottom">
        <span className="mono-label">FREQUENTLY ASKED QUESTIONS</span>
      </div>
      {faqData.map((faq, index) => {
        const open = activeIndex === index;
        return (
          <div className="faq__item hairline-bottom" key={index}>
            <button
              className="faq__question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={open}
            >
              <span className="faq__question-text">{faq.question}</span>
              <span
                className={`faq__icon${open ? " faq__icon--open" : ""}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  className="faq__answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
}
