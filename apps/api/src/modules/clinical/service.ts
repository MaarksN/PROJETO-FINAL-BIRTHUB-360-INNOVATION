import { createAppointmentMethods } from "./service-appointments";
import { createClinicalNoteMethods } from "./service-notes";
import { createPatientMethods } from "./service-patients";

export const clinicalService = {
  ...createPatientMethods(),
  ...createAppointmentMethods(),
  ...createClinicalNoteMethods()
};
