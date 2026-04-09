// @ts-nocheck
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";

import {
  buildGrowthCurvePath,
  calculateDueDateFromLmp,
  createClinicalNote,
  deleteClinicalNote,
  deletePatient,
  loadPatientDetail,
  saveNeonatalRecord,
  savePregnancyRecord,
  updateClinicalNote,
  updatePatient,
  type PatientDetailResponse
} from "../clinical-data";

type PatientFormState = {
  allergies: string;
  bloodType: string;
  chronicConditions: string;
  email: string;
  fullName: string;
  notes: string;
  phone: string;
  preferredName: string;
  status: "ACTIVE" | "ARCHIVED" | "INACTIVE";
};

type PregnancyFormState = {
  complications: string;
  fetalCount: string;
  gravidity: string;
  lastMenstrualPeriod: string;
  notes: string;
  parity: string;
  previousCesareans: string;
  riskLevel: "" | "HIGH" | "LOW" | "MODERATE";
  status: "" | "ACTIVE" | "CLOSED" | "DELIVERED";
};

type NoteFormState = {
  assessment: string;
  objective: string;
  plan: string;
  subjective: string;
  title: string;
};

type NeonatalFormState = {
  apgar1: string;
  apgar5: string;
  birthWeightGrams: string;
  bornAt: string;
  newbornName: string;
  notes: string;
  outcome: "" | "ALIVE" | "ICU" | "STILLBIRTH" | "TRANSFERRED";
  sex: "" | "FEMALE" | "MALE" | "UNDETERMINED";
};

function toCsv(value: string[]) {
  return value.join(", ");
}

function fromCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

const initialNoteForm: NoteFormState = {
  assessment: "",
  objective: "",
  plan: "",
  subjective: "",
  title: ""
};

const initialNeonatalForm: NeonatalFormState = {
  apgar1: "",
  apgar5: "",
  birthWeightGrams: "",
  bornAt: "",
  newbornName: "",
  notes: "",
  outcome: "",
  sex: ""
};

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [detail, setDetail] = useState<PatientDetailResponse | null>(null);
  const [patientForm, setPatientForm] = useState<PatientFormState | null>(null);
  const [pregnancyForm, setPregnancyForm] = useState<PregnancyFormState | null>(null);
  const [noteForm, setNoteForm] = useState<NoteFormState>(initialNoteForm);
  const [neonatalForm, setNeonatalForm] = useState<NeonatalFormState>(initialNeonatalForm);
  const [editingNoteGroupId, setEditingNoteGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const refresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const payload = await loadPatientDetail(id);
      setDetail(payload);
      setPatientForm({
        allergies: toCsv(payload.patient.allergies),
        bloodType: payload.patient.bloodType ?? "",
        chronicConditions: toCsv(payload.patient.chronicConditions),
        email: payload.patient.email ?? "",
        fullName: payload.patient.fullName,
        notes: payload.patient.notes ?? "",
        phone: payload.patient.phone ?? "",
        preferredName: payload.patient.preferredName ?? "",
        status: payload.patient.status
      });
      setPregnancyForm({
        complications: toCsv(payload.activePregnancy?.complications ?? []),
        fetalCount: payload.activePregnancy?.fetalCount ? String(payload.activePregnancy.fetalCount) : "",
        gravidity: payload.activePregnancy?.gravidity ? String(payload.activePregnancy.gravidity) : "",
        lastMenstrualPeriod: toDateInput(payload.activePregnancy?.lastMenstrualPeriod ?? null),
        notes: payload.activePregnancy?.notes ?? "",
        parity: payload.activePregnancy?.parity ? String(payload.activePregnancy.parity) : "",
        previousCesareans: payload.activePregnancy?.previousCesareans
          ? String(payload.activePregnancy.previousCesareans)
          : "",
        riskLevel: payload.activePregnancy?.riskLevel ?? "",
        status: payload.activePregnancy?.status ?? ""
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar prontuario.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [id]);

  const submitPatient = () => {
    if (!patientForm) {
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          await updatePatient(id, {
            allergies: fromCsv(patientForm.allergies),
            bloodType: patientForm.bloodType || undefined,
            chronicConditions: fromCsv(patientForm.chronicConditions),
            email: patientForm.email || undefined,
            fullName: patientForm.fullName,
            notes: patientForm.notes || undefined,
            phone: patientForm.phone || undefined,
            preferredName: patientForm.preferredName || undefined,
            status: patientForm.status
          });
          await refresh();
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Falha ao salvar paciente.");
        }
      })();
    });
  };

  const submitPregnancy = () => {
    if (!pregnancyForm) {
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          await savePregnancyRecord(
            id,
            {
              complications: fromCsv(pregnancyForm.complications),
              fetalCount: pregnancyForm.fetalCount ? Number(pregnancyForm.fetalCount) : undefined,
              gravidity: pregnancyForm.gravidity ? Number(pregnancyForm.gravidity) : undefined,
              lastMenstrualPeriod: pregnancyForm.lastMenstrualPeriod || undefined,
              notes: pregnancyForm.notes || undefined,
              parity: pregnancyForm.parity ? Number(pregnancyForm.parity) : undefined,
              previousCesareans: pregnancyForm.previousCesareans
                ? Number(pregnancyForm.previousCesareans)
                : undefined,
              riskLevel: pregnancyForm.riskLevel || undefined,
              status: pregnancyForm.status || undefined
            },
            detail?.activePregnancy?.id
          );
          await refresh();
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Falha ao salvar gestacao.");
        }
      })();
    });
  };

  const submitNote = () => {
    startTransition(() => {
      void (async () => {
        try {
          const payload = {
            assessment: noteForm.assessment || undefined,
            objective: noteForm.objective || undefined,
            patientId: id,
            plan: noteForm.plan || undefined,
            subjective: noteForm.subjective || undefined,
            title: noteForm.title || undefined
          };
          if (editingNoteGroupId) {
            await updateClinicalNote(editingNoteGroupId, payload);
          } else {
            await createClinicalNote(payload);
          }
          setEditingNoteGroupId(null);
          setNoteForm(initialNoteForm);
          await refresh();
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Falha ao salvar nota clinica.");
        }
      })();
    });
  };

  const submitNeonatal = () => {
    startTransition(() => {
      void (async () => {
        try {
          await saveNeonatalRecord(id, {
            apgar1: neonatalForm.apgar1 ? Number(neonatalForm.apgar1) : undefined,
            apgar5: neonatalForm.apgar5 ? Number(neonatalForm.apgar5) : undefined,
            birthWeightGrams: neonatalForm.birthWeightGrams
              ? Number(neonatalForm.birthWeightGrams)
              : undefined,
            bornAt: neonatalForm.bornAt,
            newbornName: neonatalForm.newbornName || undefined,
            notes: neonatalForm.notes || undefined,
            outcome: neonatalForm.outcome || undefined,
            sex: neonatalForm.sex || undefined
          });
          setNeonatalForm(initialNeonatalForm);
          await refresh();
        } catch (saveError) {
          setError(
            saveError instanceof Error ? saveError.message : "Falha ao registrar nascimento."
          );
        }
      })();
    });
  };

  const removePatient = () => {
    if (!confirm("Arquivar este paciente e todos os registros clinicos vinculados?")) {
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          await deletePatient(id);
          router.push("/patients");
        } catch (deleteError) {
          setError(deleteError instanceof Error ? deleteError.message : "Falha ao excluir paciente.");
        }
      })();
    });
  };

  const growthPath = buildGrowthCurvePath(detail?.growthCurve ?? []);
  const manualDueDate = calculateDueDateFromLmp(pregnancyForm?.lastMenstrualPeriod ?? null);

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      {error ? <p style={{ color: "#9d0208", margin: 0 }}>{error}</p> : null}
      {isLoading || !detail || !patientForm || !pregnancyForm ? <p>Carregando prontuario...</p> : null}

      {!isLoading && detail && patientForm && pregnancyForm ? (
        <>
          <header className="hero-card">
            <span className="badge">Prontuario clinico</span>
            <h1 style={{ marginBottom: "0.4rem" }}>{detail.patient.fullName}</h1>
            <p style={{ marginBottom: 0 }}>
              {detail.patient.medicalRecordNumber ?? "Sem prontuario"} · {detail.patient.phone ?? "Sem telefone"} ·{" "}
              {detail.patient.email ?? "Sem email"}
            </p>
            <div className="hero-actions" style={{ marginTop: "0.9rem" }}>
              <Link href={`/patients/${detail.patient.id}/appointments`}>Consultas da paciente</Link>
              <Link className="ghost-button" href="/appointments">
                Agenda geral
              </Link>
            </div>
          </header>

          <section className="stats-grid">
            {detail.alerts.length === 0 ? (
              <article>
                <small>Alertas</small>
                <strong>0</strong>
                <p style={{ marginBottom: 0 }}>Nenhum alerta clinico ativo com as regras minimas da fase.</p>
              </article>
            ) : (
              detail.alerts.map((alert) => (
                <article key={alert.id} style={{ borderLeft: `4px solid ${alert.severity === "high" ? "#c1121f" : alert.severity === "medium" ? "#f59e0b" : "#0f766e"}` }}>
                  <small>{alert.severity.toUpperCase()}</small>
                  <strong>{alert.title}</strong>
                  <p style={{ marginBottom: 0 }}>{alert.description}</p>
                </article>
              ))
            )}
          </section>

          <section className="stats-grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
            <article style={{ display: "grid", gap: "0.85rem" }}>
              <div>
                <h2 style={{ margin: 0 }}>Dados da paciente</h2>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                  Edicao rapida do cadastro canonico com suporte a alergias e cronicos.
                </p>
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                <label style={{ display: "grid", gap: "0.35rem" }}>Nome completo
                  <input value={patientForm.fullName} onChange={(event) => setPatientForm((current) => current ? { ...current, fullName: event.target.value } : current)} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Nome preferido
                  <input value={patientForm.preferredName} onChange={(event) => setPatientForm((current) => current ? { ...current, preferredName: event.target.value } : current)} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Telefone
                  <input value={patientForm.phone} onChange={(event) => setPatientForm((current) => current ? { ...current, phone: event.target.value } : current)} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Email
                  <input value={patientForm.email} onChange={(event) => setPatientForm((current) => current ? { ...current, email: event.target.value } : current)} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Tipo sanguineo
                  <input value={patientForm.bloodType} onChange={(event) => setPatientForm((current) => current ? { ...current, bloodType: event.target.value } : current)} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Status
                  <select value={patientForm.status} onChange={(event) => setPatientForm((current) => current ? { ...current, status: event.target.value as PatientFormState["status"] } : current)}>
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                    <option value="ARCHIVED">Arquivado</option>
                  </select>
                </label>
              </div>
              <label style={{ display: "grid", gap: "0.35rem" }}>
                Alergias
                <input
                  onChange={(event) =>
                    setPatientForm((current) =>
                      current ? { ...current, allergies: event.target.value } : current
                    )
                  }
                  placeholder="latex, dipirona"
                  value={patientForm.allergies}
                />
              </label>
              <label style={{ display: "grid", gap: "0.35rem" }}>
                Condicoes cronicas
                <input
                  onChange={(event) =>
                    setPatientForm((current) =>
                      current ? { ...current, chronicConditions: event.target.value } : current
                    )
                  }
                  placeholder="hipertensao, diabetes"
                  value={patientForm.chronicConditions}
                />
              </label>
              <label style={{ display: "grid", gap: "0.35rem" }}>
                Observacoes
                <textarea
                  onChange={(event) =>
                    setPatientForm((current) =>
                      current ? { ...current, notes: event.target.value } : current
                    )
                  }
                  rows={4}
                  value={patientForm.notes}
                />
              </label>
              <div className="panel-actions">
                <button className="action-button" disabled={isPending} onClick={submitPatient} type="button">
                  {isPending ? "Salvando..." : "Salvar cadastro"}
                </button>
                <button className="danger-button" disabled={isPending} onClick={removePatient} type="button">
                  Arquivar paciente
                </button>
              </div>
            </article>

            <article style={{ display: "grid", gap: "0.85rem" }}>
              <div>
                <h2 style={{ margin: 0 }}>Gestacao ativa e DPP</h2>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                  Base de DPP, idade gestacional e rastreio de risco usada pela fase.
                </p>
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                <label style={{ display: "grid", gap: "0.35rem" }}>DUM
                  <input value={pregnancyForm.lastMenstrualPeriod} type="date" onChange={(event) => setPregnancyForm((current) => current ? { ...current, lastMenstrualPeriod: event.target.value } : current)} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Risco
                  <select value={pregnancyForm.riskLevel} onChange={(event) => setPregnancyForm((current) => current ? { ...current, riskLevel: event.target.value as PregnancyFormState["riskLevel"] } : current)}>
                    <option value="">Nao definido</option>
                    <option value="LOW">Baixo</option>
                    <option value="MODERATE">Moderado</option>
                    <option value="HIGH">Alto</option>
                  </select>
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Status
                  <select value={pregnancyForm.status} onChange={(event) => setPregnancyForm((current) => current ? { ...current, status: event.target.value as PregnancyFormState["status"] } : current)}>
                    <option value="">Nao definido</option>
                    <option value="ACTIVE">Ativa</option>
                    <option value="DELIVERED">Encerrada com parto</option>
                    <option value="CLOSED">Fechada</option>
                  </select>
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Gesta
                  <input value={pregnancyForm.gravidity} onChange={(event) => setPregnancyForm((current) => current ? { ...current, gravidity: event.target.value } : current)} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Para
                  <input value={pregnancyForm.parity} onChange={(event) => setPregnancyForm((current) => current ? { ...current, parity: event.target.value } : current)} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Cesareas previas
                  <input value={pregnancyForm.previousCesareans} onChange={(event) => setPregnancyForm((current) => current ? { ...current, previousCesareans: event.target.value } : current)} />
                </label>
              </div>
              <label style={{ display: "grid", gap: "0.35rem" }}>
                Complicacoes
                <input
                  onChange={(event) =>
                    setPregnancyForm((current) =>
                      current ? { ...current, complications: event.target.value } : current
                    )
                  }
                  placeholder="hipertensao gestacional, anemia"
                  value={pregnancyForm.complications}
                />
              </label>
              <label style={{ display: "grid", gap: "0.35rem" }}>
                Observacoes da gestacao
                <textarea
                  onChange={(event) =>
                    setPregnancyForm((current) =>
                      current ? { ...current, notes: event.target.value } : current
                    )
                  }
                  rows={4}
                  value={pregnancyForm.notes}
                />
              </label>
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                <article>
                  <small>DPP calculada</small>
                  <strong>{manualDueDate ? new Date(manualDueDate).toLocaleDateString("pt-BR") : "N/D"}</strong>
                </article>
                <article>
                  <small>IG atual</small>
                  <strong>{detail.activePregnancy?.gestationalAgeLabel ?? "N/D"}</strong>
                </article>
                <article>
                  <small>Dias para DPP</small>
                  <strong>{detail.activePregnancy?.daysUntilDueDate ?? "N/D"}</strong>
                </article>
              </div>
              <div className="panel-actions">
                <button className="action-button" disabled={isPending} onClick={submitPregnancy} type="button">
                  {isPending ? "Salvando..." : "Salvar gestacao"}
                </button>
              </div>
            </article>
          </section>

          <section className="stats-grid" style={{ gridTemplateColumns: "1.2fr 0.8fr" }}>
            <article style={{ display: "grid", gap: "0.8rem" }}>
              <div>
                <h2 style={{ margin: 0 }}>Curva de crescimento fetal</h2>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                  Base visual a partir do peso fetal registrado nas consultas. Uso de apoio, nao diagnostico.
                </p>
              </div>
              {detail.growthCurve.length === 0 ? (
                <p style={{ marginBottom: 0 }}>Sem medidas de peso fetal suficientes para desenhar a curva.</p>
              ) : (
                <>
                  <svg height="180" style={{ background: "#f8fafc", borderRadius: 20, width: "100%" }} viewBox="0 0 420 180">
                    <path d={growthPath} fill="none" stroke="#0f766e" strokeWidth="4" />
                  </svg>
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Semana</th>
                          <th>Peso fetal</th>
                          <th>Referencia</th>
                          <th>Desvio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.growthCurve.map((point) => (
                          <tr key={point.appointmentId}>
                            <td>{point.gestationalWeek}</td>
                            <td>{point.fetalWeightGrams} g</td>
                            <td>{point.referenceGrams ? `${point.referenceGrams} g` : "N/D"}</td>
                            <td>{point.deviationPercent !== null ? `${point.deviationPercent}%` : "N/D"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </article>

            <article style={{ display: "grid", gap: "0.8rem" }}>
              <div>
                <h2 style={{ margin: 0 }}>Nascimento / neonatal</h2>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                  Registro simplificado do desfecho com dados minimos do recem-nascido.
                </p>
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                <label style={{ display: "grid", gap: "0.35rem" }}>Nome do bebe
                  <input value={neonatalForm.newbornName} onChange={(event) => setNeonatalForm((current) => ({ ...current, newbornName: event.target.value }))} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Nascimento
                  <input value={neonatalForm.bornAt} type="datetime-local" onChange={(event) => setNeonatalForm((current) => ({ ...current, bornAt: event.target.value }))} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Sexo
                  <select value={neonatalForm.sex} onChange={(event) => setNeonatalForm((current) => ({ ...current, sex: event.target.value as NeonatalFormState["sex"] }))}>
                    <option value="">Nao informar</option>
                    <option value="FEMALE">Feminino</option>
                    <option value="MALE">Masculino</option>
                    <option value="UNDETERMINED">Indeterminado</option>
                  </select>
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Peso (g)
                  <input value={neonatalForm.birthWeightGrams} onChange={(event) => setNeonatalForm((current) => ({ ...current, birthWeightGrams: event.target.value }))} />
                </label>
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}>
                <label style={{ display: "grid", gap: "0.35rem" }}>Apgar 1
                  <input value={neonatalForm.apgar1} onChange={(event) => setNeonatalForm((current) => ({ ...current, apgar1: event.target.value }))} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Apgar 5
                  <input value={neonatalForm.apgar5} onChange={(event) => setNeonatalForm((current) => ({ ...current, apgar5: event.target.value }))} />
                </label>
                <label style={{ display: "grid", gap: "0.35rem" }}>Desfecho
                  <select value={neonatalForm.outcome} onChange={(event) => setNeonatalForm((current) => ({ ...current, outcome: event.target.value as NeonatalFormState["outcome"] }))}>
                    <option value="">Padrao</option>
                    <option value="ALIVE">Vivo</option>
                    <option value="ICU">UTI</option>
                    <option value="TRANSFERRED">Transferido</option>
                    <option value="STILLBIRTH">Natimorto</option>
                  </select>
                </label>
              </div>
              <label style={{ display: "grid", gap: "0.35rem" }}>
                Observacoes
                <textarea rows={3} value={neonatalForm.notes} onChange={(event) => setNeonatalForm((current) => ({ ...current, notes: event.target.value }))} />
              </label>
              <button className="action-button" disabled={!neonatalForm.bornAt || isPending} onClick={submitNeonatal} type="button">
                {isPending ? "Salvando..." : "Registrar nascimento"}
              </button>
              <div style={{ display: "grid", gap: "0.55rem" }}>
                {detail.neonatalRecords.length === 0 ? <p style={{ margin: 0 }}>Nenhum registro neonatal ainda.</p> : null}
                {detail.neonatalRecords.map((record) => (
                  <div key={record.id} style={{ border: "1px solid var(--border)", borderRadius: 18, padding: "0.8rem" }}>
                    <strong>{record.newbornName ?? "Recem-nascido sem nome"}</strong>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      {new Date(record.bornAt).toLocaleString("pt-BR")} · {record.birthWeightGrams ?? "N/D"} g · {record.outcome}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="stats-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <article style={{ display: "grid", gap: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                <div>
                  <h2 style={{ margin: 0 }}>Notas clinicas</h2>
                  <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                    Edicao cria nova versao, preservando historico do atendimento.
                  </p>
                </div>
                <button className="ghost-button" onClick={() => { setEditingNoteGroupId(null); setNoteForm(initialNoteForm); }} type="button">
                  Nova nota
                </button>
              </div>
              <label style={{ display: "grid", gap: "0.35rem" }}>Titulo
                <input value={noteForm.title} onChange={(event) => setNoteForm((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <label style={{ display: "grid", gap: "0.35rem" }}>Subjetivo
                <textarea rows={3} value={noteForm.subjective} onChange={(event) => setNoteForm((current) => ({ ...current, subjective: event.target.value }))} />
              </label>
              <label style={{ display: "grid", gap: "0.35rem" }}>Objetivo
                <textarea rows={3} value={noteForm.objective} onChange={(event) => setNoteForm((current) => ({ ...current, objective: event.target.value }))} />
              </label>
              <label style={{ display: "grid", gap: "0.35rem" }}>Avaliacao
                <textarea rows={3} value={noteForm.assessment} onChange={(event) => setNoteForm((current) => ({ ...current, assessment: event.target.value }))} />
              </label>
              <label style={{ display: "grid", gap: "0.35rem" }}>Plano
                <textarea rows={3} value={noteForm.plan} onChange={(event) => setNoteForm((current) => ({ ...current, plan: event.target.value }))} />
              </label>
              <button className="action-button" disabled={isPending} onClick={submitNote} type="button">
                {isPending ? "Salvando..." : editingNoteGroupId ? "Criar nova versao" : "Salvar nota"}
              </button>
            </article>

            <article style={{ display: "grid", gap: "0.8rem" }}>
              <h2 style={{ margin: 0 }}>Historico recente</h2>
              {detail.clinicalNotes.length === 0 ? <p style={{ margin: 0 }}>Nenhuma nota clinica registrada.</p> : null}
              {detail.clinicalNotes.map((note) => (
                <div key={note.id} style={{ border: "1px solid var(--border)", borderRadius: 18, padding: "0.9rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                    <strong>{note.title ?? note.kind}</strong>
                    <span className="badge">v{note.version}</span>
                  </div>
                  <p style={{ color: "var(--muted)", margin: "0.35rem 0 0.65rem" }}>
                    {new Date(note.updatedAt).toLocaleString("pt-BR")} · {note.author?.name ?? "Sem autoria"}
                  </p>
                  <p style={{ marginBottom: "0.65rem" }}>{note.assessment ?? note.subjective ?? "Sem resumo"}</p>
                  <div className="panel-actions">
                    <button className="ghost-button" onClick={() => { setEditingNoteGroupId(note.noteGroupId); setNoteForm({ assessment: note.assessment ?? "", objective: note.objective ?? "", plan: note.plan ?? "", subjective: note.subjective ?? "", title: note.title ?? "" }); }} type="button">
                      Nova versao
                    </button>
                    <button className="danger-button" onClick={() => startTransition(() => { void (async () => { try { await deleteClinicalNote(note.noteGroupId); await refresh(); } catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : "Falha ao remover nota."); } })(); })} type="button">
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </article>
          </section>

          <section className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0 }}>Consultas recentes</h2>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                  Ultimas consultas registradas e atalhos para agenda completa.
                </p>
              </div>
              <Link className="action-button" href={`/patients/${detail.patient.id}/appointments`}>
                Gerenciar consultas
              </Link>
            </div>
            {detail.recentAppointments.length === 0 ? (
              <p style={{ marginBottom: 0 }}>Nenhuma consulta registrada ainda.</p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th>Resumo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.recentAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{new Date(appointment.scheduledAt).toLocaleString("pt-BR")}</td>
                        <td>{appointment.type}</td>
                        <td>{appointment.status}</td>
                        <td>{appointment.summary ?? appointment.chiefComplaint ?? "Sem resumo"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}
