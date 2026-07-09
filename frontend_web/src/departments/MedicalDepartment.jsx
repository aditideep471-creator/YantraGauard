import Page from "../components/Page";
import IncidentList from "../incidents/IncidentList";

function MedicalDepartment() {
  return (
    <Page title="Medical Department">
      <IncidentList department="Medical" />
    </Page>
  );
}

export default MedicalDepartment;