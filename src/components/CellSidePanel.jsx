'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : CellSidePanel
  PROPÓSITO  : Panel lateral “deslizable” que muestra el detalle completo de una
               célula y permite (opcionalmente) ajustar su horario fijo
               (día de la semana + hora).  Si la prop `onUpdate` viene definida
               el usuario podrá guardar los cambios; si no, el panel es solo
               de lectura.
──────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useState } from 'react';
import PropTypes              from 'prop-types';
import clsx                   from 'clsx';

/*───── Constantes ───────────────────────────────────────────────────────────*/
const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles',
                 'Jueves', 'Viernes', 'Sábado'];

/*───── Util minúsculo — devuelve un array 0–23 “00”, “01”… ──────────────────*/
const HOURS = Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0'));

/*─────────────────────────── Componente principal ───────────────────────────*/
export default function CellSidePanel({
  cell,          // objeto célula {id,name,leader,dayOfWeek,hour,meetings}
  onClose,       // () => void
  onUpdate       // (updatedObj) => void | undefined
}) {
  /* Si no hay célula seleccionada, no renderizamos nada */
  if (!cell) return null;

  /* Estado local para edición de horario */
  const [editing, setEditing] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(
    cell.dayOfWeek != null ? cell.dayOfWeek : 0
  );
  const [hour, setHour] = useState(cell.hour || '20:00');

  /* Si cambia la célula (ej. usuario selecciona otra) reiniciamos edición */
  useEffect(() => {
    setEditing(false);
    setDayOfWeek(cell.dayOfWeek != null ? cell.dayOfWeek : 0);
    setHour(cell.hour || '20:00');
  }, [cell]);

  /* ¿Puede editar? (onUpdate provisto) */
  const canEdit = typeof onUpdate === 'function';

  /* Guardar nuevo horario */
  const save = () => {
    onUpdate({
      ...cell,
      dayOfWeek,
      hour
    });
    setEditing(false);
  };

  /*───────────────────────────── Render UI ─────────────────────────────────*/
  return (
    <aside
      className={clsx(
        'fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50',
        'transform transition-transform duration-300',
        'translate-x-0'
      )}
    >
      <header className="flex justify-between items-start p-6 pb-4">
        <h2 className="text-xl font-semibold leading-tight">{cell.name}</h2>

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="text-xl leading-none text-slate-500 hover:text-slate-700"
          aria-label="Cerrar panel"
        >
          ×
        </button>
      </header>

      <section className="px-6 pb-6 overflow-y-auto h-[calc(100%-4rem)]">

        {/* ─── Datos básicos ─── */}
        <Detail label="Líder"           value={cell.leader || '—'} />
        <Detail label="Reuniones"       value={cell.meetings ?? 0} />

        {/* ─── Horario Fijo ─── */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Horario fijo</p>

          {!editing ? (
            <>
              <p className="text-sm">
                {cell.dayOfWeek == null
                  ? <em className="text-gray-400">no configurado</em>
                  : `${DAYS_ES[cell.dayOfWeek]} · ${cell.hour}h`}
              </p>

              {canEdit && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-2 text-xs text-blue-600 hover:underline"
                >
                  Cambiar horario
                </button>
              )}
            </>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                save();
              }}
              className="text-sm flex flex-col gap-2"
            >
              <select
                value={dayOfWeek}
                onChange={e => setDayOfWeek(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {DAYS_ES.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>

              <div className="flex gap-1">
                <select
                  value={hour.slice(0, 2)}
                  onChange={e => setHour(e.target.value + hour.slice(2))}
                  className="border rounded px-2 py-1 flex-1"
                >
                  {HOURS.map(h => <option key={h}>{h}</option>)}
                </select>
                <span className="self-center">:</span>
                <select
                  value={hour.slice(3)}
                  onChange={e => setHour(hour.slice(0, 3) + e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                >
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 border rounded py-1 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white rounded py-1 hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ─── Placeholder para futuras métricas ─── */}
        <div className="border-t pt-3">
          <p className="text-xs text-gray-400">
            Próximamente: métricas de asistencia, ofrendas, etc.
          </p>
        </div>

      </section>
    </aside>
  );
}

/*────────────────── Sub-componente pequeño (label + value) ─────────────────*/
function Detail({ label, value }) {
  return (
    <p className="mb-2 leading-tight">
      <span className="text-sm text-gray-500">{label}: </span>
      {value}
    </p>
  );
}

/*────────────────────────── PropTypes (opcional) ───────────────────────────*/
CellSidePanel.propTypes = {
  cell    : PropTypes.shape({
    id        : PropTypes.number.isRequired,
    name      : PropTypes.string.isRequired,
    leader    : PropTypes.string,
    dayOfWeek : PropTypes.number,
    hour      : PropTypes.string,
    meetings  : PropTypes.number
  }),
  onClose : PropTypes.func.isRequired,
  onUpdate: PropTypes.func      // opcional – determina si se puede editar
};
