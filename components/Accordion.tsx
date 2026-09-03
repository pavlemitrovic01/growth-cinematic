export type FaqItem = { id: string; q: string; a: string };
export default function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="faqlist">
      {items.map((item, index) => (
        <details className="faq-item" key={item.id} open={index === 0}>
          <summary className="faq-q">{item.q}<span className="faq-sign" aria-hidden="true">+</span></summary>
          <div className="faq-a"><p>{item.a}</p></div>
        </details>
      ))}
    </div>
  );
}
