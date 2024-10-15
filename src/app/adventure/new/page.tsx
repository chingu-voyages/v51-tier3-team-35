"use client";
import "react-datepicker/dist/react-datepicker.css";
import { AdventureCreateEditor } from "../../../components/adventure-create-editor/Adventure-create-editor";

export default function NewAdventurePage() {
  return AdventureCreateEditor({ creating: true });
}
