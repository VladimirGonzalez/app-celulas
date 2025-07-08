'use client';
/*──────────────────────────────────────────────────────────────────────────────
  COMPONENTE : CellFormModal
  PROPÓSITO  : Alta / Edición de una Célula
               – Campos: name · leader · dayOfWeek · hour
               – Valida duplicados y campos obligatorios
               – Devuelve un objeto completo listo para persistir
  PROPS
    • onClose()              → cierra el modal sin guardar
    • onSave(cellObj)        → envía la célula al componente padre (crear/editar)
    • initial   (opcional)   → objeto célula existente (para “editar”)
    • defaultHour            → string 'HH:mm' que se usará si el usuario no elige
──────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DAYS_ES } from '@/app/cells/page';

/* util interno: inicializa estado en base a props -------------------------- */
function getInitialState(initial, defaultHour) {
  return {
    id       : initial?.id        ?? Date.now(),
    name     : initial?.name      ?? '',
    leader   : initial?.leader    ?? '',
    dayOfWeek: initial?.dayOfWeek ?? new Date().getDay(), // hoy
    hour     : initial?.hour      ?? defaultHour,
    meetings : initial?.meetings  ?? 0
  };
}

export default function CellFormModal({ onClose, onSave, initial, defaultHour }) {
  /* — estado local — */
  const [state, setState] = useState(() => getInitialState(initial, defaultHour));
  const [errors, setErrors] = useState({});

  /* reset si cambian props.initial (poco habitual, pero seguro) */
  useEffect(() => {
    setState(getInitialState(initial, defaultHour));
    setErrors({});
  }, [initial, defaultHour]);

  /* — helpers — */
  /* gen setter simple  */
  const handle = (k) => (e) => setState((s) => ({ ...s, [k]: e.target.value }));
  const intDay = (v) => Number.isNaN(+v) ? 0 : +v;

  /* validación mínima */
  const validate = () => {
    const err = {};
    if (!state.name.trim())   err.name   = 'Nombre requerido';
    if (!state.leader.trim()) err.leader = 'Líder requerido';
    if (state.hour.trim().length < 4) err.hour = 'Hora inválida';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* submit */
  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    /* construimos objeto limpio */
    onSave({
      id        : state.id,
      name      : state.name.trim(),
      leader    : state.leader.trim(),
      dayOfWeek : intDay(state.dayOfWeek),
      hour      : state.hour,
      meetings  : state.meetings   // no se toca aquí
    });
    onClose();
  };

  /* — UI — */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-lg p-6 rounded shadow
                   overflow-y-auto max-h-[90vh] flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold">
          {initial ? 'Editar célula' : 'Nueva célula'}
        </h2>

        {/* NOMBRE */}
        <label className="text-sm">
          Nombre
          <input
            className={`border w-full px-2 py-1 rounded mt-1
                        ${errors.name ? 'border-red-500' : ''}`}
            value={state.name}
            onChange={handle('name')}
            autoFocus
          />
        </label>
        {errors.name && <p className="text-xs text-red-600 -mt-3">{errors.name}</p>}

        {/* LÍDER */}
        <label className="text-sm">
          Líder
          <input
            className={`border w-full px-2 py-1 rounded mt-1
                        ${errors.leader ? 'border-red-500' : ''}`}
            value={state.leader}
            onChange={handle('leader')}
          />
        </label>
        {errors.leader && (
          <p className="text-xs text-red-600 -mt-3">{errors.leader}</p>
        )}

        {/* HORARIO FIJO */}
        <fieldset className="border rounded p-3">
          <legend className="text-sm font-medium">Horario fijo</legend>

          <div className="flex gap-2 mt-2">
            {/* Día */}
            <label className="flex-1 text-sm">
              Día
              <select
                className="border w-full px-2 py-1 rounded mt-1"
                value={state.dayOfWeek}
                onChange={handle('dayOfWeek')}
              >
                {DAYS_ES.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            {/* Hora */}
            <label className="flex-1 text-sm">
              Hora
              <input
                type="time"
                className={`border w-full px-2 py-1 rounded mt-1
                            ${errors.hour ? 'border-red-500' : ''}`}
                value={state.hour}
                onChange={handle('hour')}
              />
            </label>
          </div>
          {errors.hour && <p className="text-xs text-red-600 mt-1">{errors.hour}</p>}
        </fieldset>

        {/* BOTONES */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border py-2 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {initial ? 'Guardar cambios' : 'Crear célula'}
          </button>
        </div>
      </form>
    </div>
  );
}

/*─────────────────────────── PropTypes opcional ────────────────────────────*/
CellFormModal.propTypes = {
  onClose     : PropTypes.func.isRequired,
  onSave      : PropTypes.func.isRequired,
  defaultHour : PropTypes.string.isRequired,
  initial     : PropTypes.shape({
    id        : PropTypes.number,
    name      : PropTypes.string,
    leader    : PropTypes.string,
    dayOfWeek : PropTypes.number,
    hour      : PropTypes.string,
    meetings  : PropTypes.number
  })
};
