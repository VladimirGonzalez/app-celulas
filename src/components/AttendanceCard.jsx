'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : AttendanceCard
  PROPÓSITO  : Tarjeta-resumen de una reunión + contador de presentes
  PROPS
    • env           objeto envelope (reunión)
    • cells[]       para resolver nombre de célula
    • presentCount  nº presentes actuales
    • onEdit()      abre modal de asistencia
──────────────────────────────────────────────────────────────────────────────*/

import PropTypes from 'prop-types';

export default function AttendanceCard({ env, cells, presentCount, onEdit }) {
  const cell = cells.find(c => c.id === env.cellId);

  return (
    <div className="card select-none">
      {/* encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold leading-tight">{cell?.name ?? 'Célula'}</h3>
          <p className="text-xs text-gray-500">
            {new Date(env.date).toLocaleDateString('es-AR')} · {env.hour}h
          </p>
        </div>
        <span className="text-xs bg-gray-200 px-2 rounded" title="Presentes">
          {presentCount} asis.
        </span>
      </div>

      {/* acción */}
      <button
        onClick={onEdit}
        className="mt-2 bg-blue-600 text-white w-full py-1 rounded hover:bg-blue-700"
      >
        Registrar asistencia
      </button>
    </div>
  );
}

AttendanceCard.propTypes = {
  env         : PropTypes.object.isRequired,
  cells       : PropTypes.array.isRequired,
  presentCount: PropTypes.number.isRequired,
  onEdit      : PropTypes.func.isRequired,
};
