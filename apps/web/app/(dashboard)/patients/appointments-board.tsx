"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import {
  buildAgendaHeading,
  createAppointment,
  deleteAppointment,
  loadAppointments,
  updateAppointment,
  type AppointmentSnapshot,
  type AppointmentsResponse
} from "./clinical-data";

type AppointmentFormState = {
  bloodPressureDiastolic: string;
  bloodPressureSystolic: string;
  chiefComplaint: string;
  fetalHeartRateBpm: string;
  fetalWeightGrams: string;
  patientId: string;
  providerName: string;
  scheduledAt: string;
  summary: string;
  type: "EXAM" | "POSTPARTUM" | "PRENATAL" | "ULTRASOUND" | "VACCINATION";
};

const initialAppointmentForm: AppointmentFormState = {
  bloodPressureDiastolic: "",
  bloodPressureSystolic: "",
  chiefComplaint: "",
  fetalHeartRateBpm: "",
  fetalWeightGrams: "",
  patientId: "",
  providerName: "",
  scheduledAt: "",
  summary: "",
  type: "PRENATAL"
};

export function AppointmentsBoard(props: {
  description: string;
  patientId?: string;
  patientName?: string;
  title: string;
}) {
  const [view, setView] = useState<"day" | "month" | "week">("week");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("");
  const [appointments, setAppointments] = useState<AppointmentSnapshot[]>([]);
  const [summary, setSummary] = useState<AppointmentsResponse["summary"] | null>(null);
  const [windowLabel, setWindowLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<AppointmentFormState>({
    ...initialAppointmentForm,
    patientId: props.patientId ?? ""
  });
  const [isPending, startTransition] = useTransition();

  const refresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const payload = await loadAppointments({
        date,
        ...(props.patientId ? { patientId: props.patientId } : {}),
        ...(status ? { status } : {}),
        view
      });
      setAppointments(payload.items);
      setSummary(payload.summary);
      setWindowLabel(buildAgendaHeading(payload.window.label, payload.window.anchorDate));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar agenda.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [date, status, view, props.patientId]);

  const submitAppointment = () => {
    startTransition(() => {
      void (async () => {
        try {
          await createAppointment({
            ...(form.bloodPressureDiastolic
              ? { bloodPressureDiastolic: Number(form.bloodPressureDiastolic) }
              : {}),
            ...(form.bloodPressureSystolic
              ? { bloodPressureSystolic: Number(form.bloodPressureSystolic) }
              : {}),
            ...(form.chiefComplaint ? { chiefComplaint: form.chiefComplaint } : {}),
            ...(form.fetalHeartRateBpm ? { fetalHeartRateBpm: Number(form.fetalHeartRateBpm) } : {}),
            ...(form.fetalWeightGrams ? { fetalWeightGrams: Number(form.fetalWeightGrams) } : {}),
            patientId: props.patientId ?? form.patientId,
            ...(form.providerName ? { providerName: form.providerName } : {}),
            scheduledAt: form.scheduledAt,
            ...(form.summary ? { summary: form.summary } : {}),
            type: form.type
          });
          setForm({
            ...initialAppointmentForm,
            patientId: props.patientId ?? ""
          });
          await refresh();
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Falha ao criar consulta.");
        }
      })();
    });
  };

  const patchAppointmentStatus = (appointmentId: string, nextStatus: string) => {
    startTransition(() => {
      void (async () => {
        try {
          await updateAppointment(appointmentId, { status: nextStatus });
          await refresh();
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Falha ao atualizar consulta.");
        }
      })();
    });
  };

  const removeAppointment = (appointmentId: string) => {
    startTransition(() => {
      void (async () => {
        try {
          await deleteAppointment(appointmentId);
          await refresh();
        } catch (deleteError) {
          setError(deleteError instanceof Error ? deleteError.message : "Falha ao remover consulta.");
        }
      })();
    });
  };

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <header className="hero-card">
        <span className="badge">Agenda clinica</span>
        <h1>{props.title}</h1>
        <p style={{ marginBottom: 0 }}>{props.description}</p>
        {props.patientId ? (
          <div className="hero-actions" style={{ marginTop: "0.9rem" }}>
            <Link href={`/patients/${props.patientId}`}>Voltar ao prontuario</Link>
            <Link className="ghost-button" href="/appointments">
              Abrir agenda geral
            </Link>
          </div>
        ) : null}
      </header>

      <section className="panel" style={{ display: "grid", gap: "0.85rem" }}>
        <div className="filter-row">
          <input onChange={(event) => setDate(event.target.value)} type="date" value={date} />
          <select onChange={(event) => setView(event.target.value as "day" | "month" | "week")} value={view}>
            <option value="day">Dia</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
          </select>
          <select onChange={(event) => setStatus(event.target.value)} value={status}>
            <option value="">Todos os status</option>
            <option value="SCHEDULED">Agendada</option>
            <option value="CHECKED_IN">Check-in</option>
            <option value="COMPLETED">Concluida</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="NO_SHOW">Falta</option>
          </select>
        </div>

        {error ? <p style={{ color: "#9d0208", margin: 0 }}>{error}</p> : null}
        {isLoading ? <p style={{ margin: 0 }}>Carregando agenda...</p> : null}

        {!isLoading && summary ? (
          <div className="stats-grid">
            <article>
              <small>Janela</small>
              <strong>{windowLabel}</strong>
            </article>
            <article>
              <small>Total</small>
              <strong>{summary.total}</strong>
            </article>
            <article>
              <small>Em aberto</small>
              <strong>{summary.scheduled}</strong>
            </article>
            <article>
              <small>Concluidas</small>
              <strong>{summary.completed}</strong>
            </article>
          </div>
        ) : null}
      </section>

      <section className="panel" style={{ display: "grid", gap: "0.85rem" }}>
        <h2 style={{ margin: 0 }}>Nova consulta</h2>
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
          {!props.patientId ? (
            <label style={{ display: "grid", gap: "0.35rem" }}>
              Patient ID
              <input
                onChange={(event) => setForm((current) => ({ ...current, patientId: event.target.value }))}
                placeholder="cuid do paciente"
                value={form.patientId}
              />
            </label>
          ) : null}
          <label style={{ display: "grid", gap: "0.35rem" }}>
            Data e hora
            <input
              onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))}
              type="datetime-local"
              value={form.scheduledAt}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            Tipo
            <select
              onChange={(event) =>
                setForm((current) => ({ ...current, type: event.target.value as AppointmentFormState["type"] }))
              }
              value={form.type}
            >
              <option value="PRENATAL">Prenatal</option>
              <option value="ULTRASOUND">Ultrassom</option>
              <option value="EXAM">Exame</option>
              <option value="POSTPARTUM">Puerperio</option>
              <option value="VACCINATION">Vacinacao</option>
            </select>
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            Profissional
            <input
              onChange={(event) => setForm((current) => ({ ...current, providerName: event.target.value }))}
              value={form.providerName}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            Queixa principal
            <input
              onChange={(event) => setForm((current) => ({ ...current, chiefComplaint: event.target.value }))}
              value={form.chiefComplaint}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            Sistolica
            <input
              onChange={(event) => setForm((current) => ({ ...current, bloodPressureSystolic: event.target.value }))}
              value={form.bloodPressureSystolic}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            Diastolica
            <input
              onChange={(event) => setForm((current) => ({ ...current, bloodPressureDiastolic: event.target.value }))}
              value={form.bloodPressureDiastolic}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            FCF
            <input
              onChange={(event) => setForm((current) => ({ ...current, fetalHeartRateBpm: event.target.value }))}
              value={form.fetalHeartRateBpm}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            Peso fetal (g)
            <input
              onChange={(event) => setForm((current) => ({ ...current, fetalWeightGrams: event.target.value }))}
              value={form.fetalWeightGrams}
            />
          </label>
        </div>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Resumo
          <textarea
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            rows={3}
            value={form.summary}
          />
        </label>
        <button
          className="action-button"
          disabled={!(props.patientId || form.patientId) || !form.scheduledAt || isPending}
          onClick={submitAppointment}
          type="button"
        >
          {isPending ? "Salvando..." : "Criar consulta"}
        </button>
      </section>

      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Consultas</h2>
        {!isLoading && appointments.length === 0 ? <p style={{ marginBottom: 0 }}>Nenhuma consulta nesta janela.</p> : null}
        {appointments.length > 0 ? (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Indicadores</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <strong>{appointment.patient?.preferredName ?? appointment.patient?.fullName ?? props.patientName ?? appointment.patientId}</strong>
                      {appointment.patient?.id ? (
                        <div>
                          <Link href={`/patients/${appointment.patient.id}`}>Abrir</Link>
                        </div>
                      ) : null}
                    </td>
                    <td>{new Date(appointment.scheduledAt).toLocaleString("pt-BR")}</td>
                    <td>{appointment.type}</td>
                    <td>{appointment.status}</td>
                    <td>
                      PA {appointment.bloodPressureSystolic ?? "-"} / {appointment.bloodPressureDiastolic ?? "-"}
                      <br />
                      FCF {appointment.fetalHeartRateBpm ?? "-"} · Peso {appointment.fetalWeightGrams ?? "-"}
                    </td>
                    <td>
                      <div style={{ display: "grid", gap: "0.45rem" }}>
                        <select
                          defaultValue={appointment.status}
                          onChange={(event) => patchAppointmentStatus(appointment.id, event.target.value)}
                        >
                          <option value="SCHEDULED">Agendada</option>
                          <option value="CHECKED_IN">Check-in</option>
                          <option value="COMPLETED">Concluida</option>
                          <option value="CANCELLED">Cancelada</option>
                          <option value="NO_SHOW">Falta</option>
                        </select>
                        <button className="danger-button" onClick={() => removeAppointment(appointment.id)} type="button">
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </section>
  );
}
