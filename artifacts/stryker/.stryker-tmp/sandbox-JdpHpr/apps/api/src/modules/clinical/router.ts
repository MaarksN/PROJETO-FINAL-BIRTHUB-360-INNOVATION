// @ts-nocheck
// 
import { Role } from "@birthub/database";
import { Router } from "express";

import { Auditable } from "../../audit/auditable.js";
import {
  RequireRole,
  requireAuthenticatedSession
} from "../../common/guards/index.js";
import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import { requireStringValue } from "../../lib/request-values.js";
import { validateBody } from "../../middleware/validate-body.js";
import {
  appointmentQuerySchema,
  clinicalNoteQuerySchema,
  clinicalNoteSchema,
  clinicalNoteUpdateSchema,
  createAppointmentSchema,
  createPatientSchema,
  neonatalRecordSchema,
  patientListQuerySchema,
  pregnancyRecordSchema,
  updateAppointmentSchema,
  updatePatientSchema
} from "./schemas.js";
import { clinicalService } from "./service.js";

function requireClinicalContext(request: {
  context: {
    organizationId: string | null;
    tenantId: string | null;
    userId: string | null;
  };
}) {
  if (!request.context.organizationId || !request.context.tenantId) {
    throw new ProblemDetailsError({
      detail: "A valid tenant-aware authenticated session is required.",
      status: 401,
      title: "Unauthorized"
    });
  }

  return {
    organizationId: request.context.organizationId,
    tenantId: request.context.tenantId,
    userId: request.context.userId
  };
}

export function createClinicalRouter(): Router {
  const router = Router();

  router.get(
    "/patients",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const filters = patientListQuerySchema.parse(
        request.query
      ) as Parameters<typeof clinicalService.listPatients>[1];
      const payload = await clinicalService.listPatients(requireClinicalContext(request), filters);

      response.status(200).json({
        ...payload,
        requestId: request.context.requestId
      });
    })
  );

  router.post(
    "/patients",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(createPatientSchema),
    asyncHandler(
      Auditable({
        action: "patient.created",
        entityType: "patient",
        requireActor: true,
        resolveEntityId: (_request, _response, result) =>
          typeof result === "object" && result && "patient" in result
            ? String((result as { patient?: { id?: string } }).patient?.id ?? "")
            : undefined
      })(async (request, response) => {
        const payload = await clinicalService.createPatient(
          requireClinicalContext(request),
          createPatientSchema.parse(request.body) as Parameters<typeof clinicalService.createPatient>[1]
        );

        response.status(201).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.get(
    "/patients/:id",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const patientId = requireStringValue(request.params.id, "A valid patient id is required.");
      const payload = await clinicalService.getPatientDetail(requireClinicalContext(request), patientId);

      response.status(200).json({
        ...payload,
        requestId: request.context.requestId
      });
    })
  );

  router.patch(
    "/patients/:id",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(updatePatientSchema),
    asyncHandler(
      Auditable({
        action: "patient.updated",
        entityType: "patient",
        requireActor: true,
        resolveEntityId: (request) => request.params.id
      })(async (request, response) => {
        const patientId = requireStringValue(request.params.id, "A valid patient id is required.");
        const payload = await clinicalService.updatePatient(
          requireClinicalContext(request),
          patientId,
          updatePatientSchema.parse(request.body) as Parameters<typeof clinicalService.updatePatient>[2]
        );

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.delete(
    "/patients/:id",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    asyncHandler(
      Auditable({
        action: "patient.deleted",
        entityType: "patient",
        requireActor: true,
        resolveEntityId: (request) => request.params.id
      })(async (request, response) => {
        const patientId = requireStringValue(request.params.id, "A valid patient id is required.");
        const payload = await clinicalService.deletePatient(requireClinicalContext(request), patientId);

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.post(
    "/patients/:id/pregnancy-records",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(pregnancyRecordSchema),
    asyncHandler(
      Auditable({
        action: "patient.pregnancy_record_saved",
        entityType: "pregnancy_record",
        requireActor: true,
        resolveEntityId: (_request, _response, result) =>
          typeof result === "object" && result && "activePregnancy" in result
            ? String((result as { activePregnancy?: { id?: string } | null }).activePregnancy?.id ?? "")
            : undefined
      })(async (request, response) => {
        const patientId = requireStringValue(request.params.id, "A valid patient id is required.");
        const payload = await clinicalService.savePregnancyRecord(requireClinicalContext(request), {
          patientId,
          payload:
            pregnancyRecordSchema.parse(request.body) as Parameters<
              typeof clinicalService.savePregnancyRecord
            >[1]["payload"]
        });

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.patch(
    "/patients/:id/pregnancy-records/:recordId",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(pregnancyRecordSchema),
    asyncHandler(
      Auditable({
        action: "patient.pregnancy_record_saved",
        entityType: "pregnancy_record",
        requireActor: true,
        resolveEntityId: (request) => request.params.recordId
      })(async (request, response) => {
        const patientId = requireStringValue(request.params.id, "A valid patient id is required.");
        const recordId = requireStringValue(
          request.params.recordId,
          "A valid pregnancy record id is required."
        );
        const payload = await clinicalService.savePregnancyRecord(requireClinicalContext(request), {
          patientId,
          payload:
            pregnancyRecordSchema.parse(request.body) as Parameters<
              typeof clinicalService.savePregnancyRecord
            >[1]["payload"],
          recordId
        });

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.post(
    "/patients/:id/neonatal-records",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(neonatalRecordSchema),
    asyncHandler(
      Auditable({
        action: "patient.neonatal_record_saved",
        entityType: "neonatal_record",
        requireActor: true
      })(async (request, response) => {
        const patientId = requireStringValue(request.params.id, "A valid patient id is required.");
        const payload = await clinicalService.saveNeonatalRecord(requireClinicalContext(request), {
          patientId,
          payload:
            neonatalRecordSchema.parse(request.body) as Parameters<
              typeof clinicalService.saveNeonatalRecord
            >[1]["payload"]
        });

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.patch(
    "/patients/:id/neonatal-records/:recordId",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(neonatalRecordSchema),
    asyncHandler(
      Auditable({
        action: "patient.neonatal_record_saved",
        entityType: "neonatal_record",
        requireActor: true,
        resolveEntityId: (request) => request.params.recordId
      })(async (request, response) => {
        const patientId = requireStringValue(request.params.id, "A valid patient id is required.");
        const recordId = requireStringValue(
          request.params.recordId,
          "A valid neonatal record id is required."
        );
        const payload = await clinicalService.saveNeonatalRecord(requireClinicalContext(request), {
          patientId,
          payload:
            neonatalRecordSchema.parse(request.body) as Parameters<
              typeof clinicalService.saveNeonatalRecord
            >[1]["payload"],
          recordId
        });

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.get(
    "/appointments",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const filters = appointmentQuerySchema.parse(request.query);
      const payload = await clinicalService.listAppointments(
        requireClinicalContext(request),
        {
          ...(filters.date ? { anchorDate: filters.date } : {}),
          ...(filters.patientId ? { patientId: filters.patientId } : {}),
          ...(filters.status ? { status: filters.status } : {}),
          view: filters.view
        } as Parameters<typeof clinicalService.listAppointments>[1]
      );

      response.status(200).json({
        ...payload,
        requestId: request.context.requestId
      });
    })
  );

  router.post(
    "/appointments",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(createAppointmentSchema),
    asyncHandler(
      Auditable({
        action: "appointment.created",
        entityType: "appointment",
        requireActor: true,
        resolveEntityId: (_request, _response, result) =>
          typeof result === "object" && result && "appointment" in result
            ? String((result as { appointment?: { id?: string } }).appointment?.id ?? "")
            : undefined
      })(async (request, response) => {
        const payload = await clinicalService.createAppointment(
          requireClinicalContext(request),
          createAppointmentSchema.parse(request.body) as Parameters<
            typeof clinicalService.createAppointment
          >[1]
        );

        response.status(201).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.get(
    "/appointments/:id",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const appointmentId = requireStringValue(
        request.params.id,
        "A valid appointment id is required."
      );
      const payload = await clinicalService.getAppointment(
        requireClinicalContext(request),
        appointmentId
      );

      response.status(200).json({
        ...payload,
        requestId: request.context.requestId
      });
    })
  );

  router.patch(
    "/appointments/:id",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(updateAppointmentSchema),
    asyncHandler(
      Auditable({
        action: "appointment.updated",
        entityType: "appointment",
        requireActor: true,
        resolveEntityId: (request) => request.params.id
      })(async (request, response) => {
        const appointmentId = requireStringValue(
          request.params.id,
          "A valid appointment id is required."
        );
        const payload = await clinicalService.updateAppointment(
          requireClinicalContext(request),
          appointmentId,
          updateAppointmentSchema.parse(request.body) as Parameters<
            typeof clinicalService.updateAppointment
          >[2]
        );

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.delete(
    "/appointments/:id",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    asyncHandler(
      Auditable({
        action: "appointment.deleted",
        entityType: "appointment",
        requireActor: true,
        resolveEntityId: (request) => request.params.id
      })(async (request, response) => {
        const appointmentId = requireStringValue(
          request.params.id,
          "A valid appointment id is required."
        );
        const payload = await clinicalService.deleteAppointment(
          requireClinicalContext(request),
          appointmentId
        );

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.get(
    "/clinical-notes",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const filters = clinicalNoteQuerySchema.parse(
        request.query
      ) as Parameters<typeof clinicalService.listClinicalNotes>[1];
      const payload = await clinicalService.listClinicalNotes(requireClinicalContext(request), filters);

      response.status(200).json({
        ...payload,
        requestId: request.context.requestId
      });
    })
  );

  router.get(
    "/clinical-notes/:noteGroupId/history",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const noteGroupId = requireStringValue(
        request.params.noteGroupId,
        "A valid clinical note group id is required."
      );
      const payload = await clinicalService.getClinicalNoteHistory(
        requireClinicalContext(request),
        noteGroupId
      );

      response.status(200).json({
        ...payload,
        requestId: request.context.requestId
      });
    })
  );

  router.post(
    "/clinical-notes",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(clinicalNoteSchema),
    asyncHandler(
      Auditable({
        action: "clinical_note.created",
        entityType: "clinical_note",
        requireActor: true,
        resolveEntityId: (_request, _response, result) =>
          typeof result === "object" && result && "note" in result
            ? String((result as { note?: { noteGroupId?: string } }).note?.noteGroupId ?? "")
            : undefined
      })(async (request, response) => {
        const payload = await clinicalService.createClinicalNote(
          requireClinicalContext(request),
          clinicalNoteSchema.parse(request.body) as Parameters<typeof clinicalService.createClinicalNote>[1]
        );

        response.status(201).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.patch(
    "/clinical-notes/:noteGroupId",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    validateBody(clinicalNoteUpdateSchema),
    asyncHandler(
      Auditable({
        action: "clinical_note.versioned",
        entityType: "clinical_note",
        requireActor: true,
        resolveEntityId: (request) => request.params.noteGroupId
      })(async (request, response) => {
        const noteGroupId = requireStringValue(
          request.params.noteGroupId,
          "A valid clinical note group id is required."
        );
        const payload = await clinicalService.updateClinicalNote(
          requireClinicalContext(request),
          noteGroupId,
          clinicalNoteUpdateSchema.parse(request.body) as Parameters<
            typeof clinicalService.updateClinicalNote
          >[2]
        );

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  router.delete(
    "/clinical-notes/:noteGroupId",
    requireAuthenticatedSession,
    RequireRole(Role.MEMBER),
    asyncHandler(
      Auditable({
        action: "clinical_note.deleted",
        entityType: "clinical_note",
        requireActor: true,
        resolveEntityId: (request) => request.params.noteGroupId
      })(async (request, response) => {
        const noteGroupId = requireStringValue(
          request.params.noteGroupId,
          "A valid clinical note group id is required."
        );
        const payload = await clinicalService.deleteClinicalNote(
          requireClinicalContext(request),
          noteGroupId
        );

        response.status(200).json({
          ...payload,
          requestId: request.context.requestId
        });
        return payload;
      })
    )
  );

  return router;
}
