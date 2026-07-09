import Page from "../components/Page";
import IncidentList from "../incidents/IncidentList";

function FireDepartment() {
  return (
    <Page title="Fire & Safety Department">
      <IncidentList department="Fire and Safety" />
    </Page>
  );
}

export default FireDepartment;