'use client';
import clsx from 'clsx';

/**
 * Panel lateral con el detalle del sobre
 * @param {Object|null} env      – sobre a mostrar
 * @param {Function}    onClose  – cierra el panel
 * @param {Object[]}    cells    – lista de células
 * @param {Object[]}    members  – lista de miembros
 */
export default function EnvelopeSidePanel({ env, onClose, cells, members }) {
  if (!env) return null;

  /* — datos relacionados — */
  const cell      = cells   .find(c => c.id === env.cellId);
  const presentes = members .filter(m => env.attendeesIds.includes(m.id));

  const Detail = ({ label, value }) => (
    <p className="mb-2 leading-tight">
      <span className="text-sm text-gray-500">{label}: </span>{value}
    </p>
  );

  return (
    <aside
      className={clsx(
        'fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 z-40',
        'transition-transform duration-300',
        'translate-x-0'
      )}
    >
      <h2 className="text-xl font-semibold mb-2">{cell?.name}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(env.date).toLocaleDateString('es-AR')} · {env.hour}h
      </p>

      <Detail label="Líder"         value={env.leader} />
      <Detail label="Anfitrión"     value={env.host} />
      <Detail label="Asistencia"    value={`${presentes.length} miembros`} />

      {/* — lista de presentes — */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Presentes</p>
        <ul className="text-sm list-disc list-inside">
          {presentes.map(p => <li key={p.id}>{p.fullName}</li>)}
        </ul>
      </div>

      {/* — montos — */}
      <Detail label="Efectivo"      value={`$${env.cashAmount.toFixed(2)}`} />
      <Detail label="Transferencia" value={`$${env.transferAmount.toFixed(2)}`} />

      {/* — comprobantes — */}
      {env.transferImages.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-1">Comprobantes</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {env.transferImages.map((src, i) => (
              <img key={i} src={src} alt={`comprobante-${i}`}
                   className="w-full h-20 object-cover rounded border"/>
            ))}
          </div>
        </>
      )}

      <button onClick={onClose}
              className="bg-blue-600 text-white w-full py-2 rounded">
        Cerrar
      </button>
    </aside>
  );
}
