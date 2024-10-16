import "react-datepicker/dist/react-datepicker.css";
import { AdventureSetupComponent } from "../../../components/advebture-setup-component/Adeventure-setup-component";

export default function NewAdventurePage() {
  return AdventureSetupComponent({ creating: true, title: "New Adventure" });
}
