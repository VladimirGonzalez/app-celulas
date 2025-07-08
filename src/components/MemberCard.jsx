'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : MemberCard
  PROPÓSITO  : Tarjeta-resumen para el listado de miembros
               – Muestra nombre, célula, teléfono y fecha de alta
               – Emite callbacks: onView · onEdit · onDelete
  PROPS
    • member    { id, fullName, phone, joinDate:'YYYY-MM-DD', cellId }
    • cells[]   listado completo de células (para resolver nombre)
    • onView()    abre panel lateral
    • onEdit()    abre modal edición
    • onDelete()  elimina
──────────────────────────────────────────────────────────────────────────────*/

import PropTypes from 'prop-types';

export default function MemberCard({ member, cells, onView, onEdit, onDelete }) {
  const cell = cells.find(c => c.id === member.cellId);

  return (
    <div
      className="card relative select-none
                 md:grid md:grid-cols-[1fr_auto] md:items-center"
    >
      {/* ── datos principales ── */}
      <div>
        <h3 className="font-semibold leading-tight">{member.fullName}</h3>

        <p className="text-xs text-gray-500">
          Célula:{' '}
          <span className="text-gray-700">{cell?.name ?? '—'}</span>
        </p>

        {member.phone && (
          <p className="text-xs text-gray-500">📞 {member.phone}</p>
        )}

        <p className="text-xs text-gray-400">
          Alta: {new Date(member.joinDate).toLocaleDateString('es-AR')}
        </p>
      </div>

      {/* ── acciones ── */}
      <div className="mt-3 md:mt-0 md:text-right space-x-1 shrink-0">
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

MemberCard.propTypes = {
  member  : PropTypes.object.isRequired,
  cells   : PropTypes.array.isRequired,
  onView  : PropTypes.func.isRequired,
  onEdit  : PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
