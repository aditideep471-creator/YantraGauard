import Page from "../components/Page";
import IncidentList from "../incidents/IncidentList";

function MechanicalDepartment() {
  return (
    <Page title="Mechanical Department">
      <IncidentList department="Mechanical" />
    </Page>
  );
}

export default MechanicalDepartment;