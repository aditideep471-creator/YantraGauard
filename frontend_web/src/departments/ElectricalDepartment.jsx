import Page from "../components/Page";
import IncidentList from "../incidents/IncidentList";

function ElectricalDepartment() {
  return (
    <Page title="Electrical Department">
      <IncidentList department="Electrical" />
    </Page>
  );
}

export default ElectricalDepartment;