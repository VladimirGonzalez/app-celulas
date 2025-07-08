'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : CellCard
  PROPÓSITO  : Tarjeta-resumen de una célula en el listado principal
               – Muestra nombre, líder, horario fijo y nº de reuniones
               – Emite callbacks: onView · onEdit · onDelete
               – Visual responsive: ocupa todo el ancho en móvil, 2-col en md
  PROPS
    • cell      { id:number, name:string, leader:string,
                  dayOfWeek:number|null, hour:string|null, meetings:number }
    • onView()     → abre panel lateral (detalle)
    • onEdit()     → abre modal de edición
    • onDelete()   → elimina la célula
──────────────────────────────────────────────────────────────────────────────*/

import PropTypes from 'prop-types';
import { DAYS_ES } from '@/app/cells/page';  // array ['Dom','Lun',...]

export default function CellCard({ cell, onView, onEdit, onDelete }) {
  /* util: formatea horario si existe */
  const horario =
    cell.dayOfWeek != null && cell.hour
      ? `${DAYS_ES[cell.dayOfWeek]} · ${cell.hour}h`
      : '— sin horario fijo —';

  return (
    <div
      className="card relative select-none
                 md:grid md:grid-cols-[1fr_auto] md:items-center"
    >
      {/* ─── datos principales ─── */}
      <div>
        <h3 className="font-semibold leading-tight">{cell.name}</h3>

        <p className="text-xs text-gray-500">
          Líder: <span className="text-gray-700">{cell.leader || '—'}</span>
        </p>

        <p className="text-xs text-gray-500">{horario}</p>
      </div>

      {/* ─── meta + acciones ─── */}
      <div className="mt-3 md:mt-0 md:text-right space-x-1 shrink-0">
        {/* nº reuniones */}
        <span
          className="inline-block bg-gray-200 text-xs px-2 py-0.5 rounded
                     align-middle mb-1 md:mb-0"
          title="Reuniones registradas"
        >
          {cell.meetings} reun.
        </span>

        {/* botones */}
        <button
          onClick={onView}
          title="Ver"
          className="inline-block bg-blue-600 text-white text-xs
                     px-2 py-1 rounded hover:bg-blue-700"
        >
          Ver
        </button>
        <button
          onClick={onEdit}
          title="Editar"
          className="inline-block bg-indigo-600 text-white text-xs
                     px-2 py-1 rounded hover:bg-indigo-700"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          title="Eliminar"
          className="inline-block bg-red-500 text-white text-xs
                     px-2 py-1 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

/*──────────────────────── PropTypes opcional ───────────────────────────────*/
CellCard.propTypes = {
  cell: PropTypes.shape({
    id        : PropTypes.number.isRequired,
    name      : PropTypes.string.isRequired,
    leader    : PropTypes.string,
    dayOfWeek : PropTypes.number,
    hour      : PropTypes.string,
    meetings  : PropTypes.number
  }).isRequired,
  onView  : PropTypes.func.isRequired,
  onEdit  : PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
