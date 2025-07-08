'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : OfferingCard
  PROPÓSITO  : Tarjeta simple con los montos de una reunión
  PROPS
    • env    sobre (envelope) completo
    • cells  lista de células para resolver nombre
──────────────────────────────────────────────────────────────────────────────*/

import PropTypes from 'prop-types';

export default function OfferingCard({ env, cells }) {
  const cell = cells.find(c => c.id === env.cellId);

  return (
    <div className="card select-none">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold leading-tight">
            {cell?.name ?? 'Célula'}
          </h3>
          <p className="text-xs text-gray-500">
            {new Date(env.date).toLocaleDateString('es-AR')} · {env.hour}h
          </p>
        </div>
        <span className="text-xs bg-gray-200 px-2 rounded">
          {env.attendeesIds.length} asis.
        </span>
      </div>

      <p className="text-sm mt-1 whitespace-nowrap">
        💵 <strong>${env.cashAmount.toFixed(2)}</strong> &nbsp;&nbsp;
        💳 <strong>${env.transferAmount.toFixed(2)}</strong>
      </p>
    </div>
  );
}

OfferingCard.propTypes = {
  env  : PropTypes.object.isRequired,
  cells: PropTypes.array.isRequired,
};
