export type FaqItem = { id: string; q: string; a: string };

/**
 * ⚠️ NASLOV JE UNUTAR `<summary>`-ja, i to je legalno: sadrzaj `summary`-ja je phrasing
 * content, opciono izmesan sa heading sadrzajem.
 *
 * ⚠️ ZASTO JE `U1` to uopste dodao. Do tada je pitanje bilo goli tekst, pa je `/faq` imao
 * jedan `h1` i tri `h2` — sva tri iz futera — a osam pitanja nije davalo nijedan naslov.
 * Citac ekrana zato nije mogao da skace sa pitanja na pitanje, nego je morao da slusa sve u
 * nizu; Google je istu stranicu video kao jedan naslov i gomilu teksta.
 *
 * ⚠️ `level` postoji jer isti spisak stoji na DVA mesta: na `/faq` ispod `h1` (nivo 2), a na
 * naslovnoj unutar sekcije koja vec nosi `<h2 id="faq-heading">` (nivo 3). Bez toga bi jedno
 * od ta dva mesta preskocilo nivo.
 *
 * ⚠️ `anchors` NIJE uvek ukljucen, i to je namerno. Sidra imaju smisla na `/faq`, gde se
 * linkuje jedno pitanje. Na naslovnoj bi ista imena (`#pay`, `#violations`) stajala po drugi
 * put na istom sajtu, pored postojecih `#pay-heading` i `#faq-heading` — zabuna bez koristi.
 * Kolizije danas nema (izmereno), ali dva sidra istog imena na dve rute nisu obuhvat nego sum.
 */
export default function Accordion({
  items,
  level = 2,
  anchors = false,
}: {
  items: FaqItem[];
  level?: 2 | 3;
  anchors?: boolean;
}) {
  const Heading = level === 3 ? 'h3' : 'h2';
  return (
    <div className="faqlist">
      {items.map((item, index) => (
        <details className="faq-item" key={item.id} id={anchors ? item.id : undefined} open={index === 0}>
          <summary className="faq-q">
            <Heading>{item.q}</Heading>
            <span className="faq-sign" aria-hidden="true">+</span>
          </summary>
          <div className="faq-a"><p>{item.a}</p></div>
        </details>
      ))}
    </div>
  );
}
