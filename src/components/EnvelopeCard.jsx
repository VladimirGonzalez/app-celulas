'use client';
import clsx from 'clsx';

/**
 * Tarjeta-resumen de un “sobre”
 * @param {Object}   env                    – sobre completo
 * @param {Function} onView()              – abre panel lateral
 * @param {Function} onDelete()            – elimina
 * @param {Object[]} cells                 – lista de células {id,name}
 */
export default function EnvelopeCard({ env, onView, onDelete, cells }) {
  const cell = cells.find(c => c.id === env.cellId);

  return (
    <div className="card select-none">
      {/* — encabezado — */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold leading-tight">{cell?.name ?? 'Célula'}</h3>
          <p className="text-xs text-gray-500">
            {new Date(env.date).toLocaleDateString('es-AR')} · {env.hour}h
          </p>
        </div>
        <span className="text-xs bg-gray-200 px-2 rounded">
          {env.attendeesIds.length} asis.
        </span>
      </div>

      {/* — montos — */}
      <p className="text-xs mt-1 whitespace-nowrap">
        💵 ${env.cashAmount.toFixed(2)} · 💳 ${env.transferAmount.toFixed(2)}
      </p>

      {/* — acciones — */}
      <div className="flex gap-3 mt-2">
        <button onClick={onView}   className="flex-1 bg-blue-600  text-white py-1 rounded">Ver</button>
        <button onClick={onDelete} className="flex-1 bg-red-500   text-white py-1 rounded">Eliminar</button>
      </div>
    </div>
  );
}
