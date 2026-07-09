import api from "./axios";

export const fetchIncidents = async () => {
  const res = await api.get("/incidents");
  return res.data;
};

export const uploadIncident = async (formData) => {
  const res = await api.post("/incidents/upload", formData);
  return res.data;
};
export const updateIncidentStatus = async (incidentId, status) => {
  const res = await api.put(`/incidents/${incidentId}/status`, {
    status,
  });
  return res.data;
};
