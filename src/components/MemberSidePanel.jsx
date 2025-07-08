'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : MemberSidePanel
  PROPÓSITO  : Panel lateral con el detalle de un miembro
               – Solo lectura + botón Eliminar opcional
  PROPS
    • member   objeto miembro completo
    • cells[]  para resolver nombre de célula
    • onClose()
    • onDelete()   si se pasa ⇒ muestra botón Eliminar
──────────────────────────────────────────────────────────────────────────────*/

import clsx from 'clsx';
import PropTypes from 'prop-types';

export default function MemberSidePanel({ member, cells, onClose, onDelete }) {
  if (!member) return null;
  const cell = cells.find(c => c.id === member.cellId);

  const Detail = ({ label, value }) => (
    <p className="mb-2 leading-tight">
      <span className="text-sm text-gray-500">{label}: </span>
      {value || <em className="text-gray-400">—</em>}
    </p>
  );

  return (
    <aside
      className={clsx(
        'fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50',
        'transform transition-transform duration-300 translate-x-0'
      )}
    >
      <header className="flex justify-between items-start p-6 pb-4">
        <h2 className="text-xl font-semibold leading-tight">{member.fullName}</h2>

        <button
          onClick={onClose}
          className="text-xl leading-none text-slate-500 hover:text-slate-700"
          aria-label="Cerrar panel"
        >
          ×
        </button>
      </header>

      <section className="px-6 pb-6 overflow-y-auto h-[calc(100%-4rem)]">
        <Detail label="Célula"  value={cell?.name} />
        <Detail label="Teléfono" value={member.phone} />
        <Detail
          label="Fecha de ingreso"
          value={new Date(member.joinDate).toLocaleDateString('es-AR')}
        />

        {onDelete && (
          <button
            onClick={() => {
              if (confirm('¿Eliminar este miembro?')) onDelete();
            }}
            className="mt-6 bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
          >
            Eliminar miembro
          </button>
        )}
      </section>
    </aside>
  );
}

MemberSidePanel.propTypes = {
  member  : PropTypes.object,
  cells   : PropTypes.array.isRequired,
  onClose : PropTypes.func.isRequired,
  onDelete: PropTypes.func, // opcional
};
