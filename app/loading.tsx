/**
 * Prelazno stanje. Vecina ruta je prerenderovana i ovo se nikad ne vidi; stvarna
 * svrha je `/truckers-lounge/[slug]`, koji je dinamican (`dynamicParams = true`) —
 * bez ovoga nepoznat slug daje prazan ekran dok se ne razresi u 404.
 *
 * ⚠️ Namerno TIHO. Pun ekran preko sadrzaja bi na prerenderovanim rutama pravio
 * bljesak umesto da resava problem; ovo je traka na vrhu koja se ne primeti kad je
 * navigacija brza.
 *
 * ⚠️ `prefers-reduced-motion` gasi animaciju i ostavlja statican indikator —
 * animacija koja se ne moze zaustaviti je a11y problem, ne ukras.
 */
export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <span className="route-loading-bar" aria-hidden="true" />
    </div>
  );
}
