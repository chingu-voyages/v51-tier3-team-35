import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { EventType } from "../../lib/models/occurrence.model";
import { accommodationOccurrence } from "./accommodation/Accommodation-occurence-modal";
import { activityOccurrenceModal } from "./activity/Activity-occurrence-modal";
import { OccurrenceSubmissionData } from "./definitions";
import { foodOccurrenceModal } from "./food/Food-occurrence-modal";
import { travelOccurrence } from "./travel/Travel-occurrence-modal";

interface OccurrenceModalProps {
  id: string;
  occurrenceType: EventType; // Events and occurrences are the same thing.
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (
    data: OccurrenceSubmissionData,
    { notes, description }: { notes?: string; description?: string }
  ) => void;
}

export function OccurrenceModal(props: OccurrenceModalProps) {
  /* 
  Travel occurrence state
  */

  const handleDataSubmit = (data: OccurrenceSubmissionData) => {
    props.onSubmit && props.onSubmit(data, { notes, description });
  };

  const getModalType = (occurrenceType: EventType) => {
    switch (occurrenceType) {
      case "travel":
        return travelOccurrence(
          {
            onCloseModal: props.onClose,
            onSubmit: handleDataSubmit,
          },
          [
            <FreeTextSection
              title="Description"
              text={description}
              placeholder="Description"
              setText={setDescription}
            />,
            <FreeTextSection
              title="Notes"
              text={notes}
              placeholder="Notes"
              setText={setNotes}
            />,
          ]
        );
      case "accommodation":
        return accommodationOccurrence(
          {
            onCloseModal: props.onClose,
            onSubmit: handleDataSubmit,
          },
          [
            <FreeTextSection
              title="Description"
              text={description}
              placeholder="Description"
              setText={setDescription}
            />,
            <FreeTextSection
              title="Notes"
              text={notes}
              placeholder="Notes"
              setText={setNotes}
            />,
          ]
        );
      case "activity":
        return activityOccurrenceModal(
          {
            onCloseModal: props.onClose,
            onSubmit: handleDataSubmit,
          },
          [
            <FreeTextSection
              title="Description"
              text={description}
              placeholder="Description"
              setText={setDescription}
            />,
            <FreeTextSection
              title="Notes"
              text={notes}
              placeholder="Notes"
              setText={setNotes}
            />,
          ]
        );
      case "food":
        return foodOccurrenceModal(
          {
            onCloseModal: props.onClose,
            onSubmit: handleDataSubmit,
          },
          [
            <FreeTextSection
              title="Description"
              text={description}
              placeholder="Description"
              setText={setDescription}
            />,
            <FreeTextSection
              title="Notes"
              text={notes}
              placeholder="Notes"
              setText={setNotes}
            />,
          ]
        );
    }
  };

  if (!props.isOpen) {
    return null;
  }

  const [notes, setNotes] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  return (
    <div className={`absolute w-full top-[0] modal-container`}>
      <div className="modal-box w-11/12 max-w-5xl">
        {/* Modal header */}
        {getModalType(props.occurrenceType)}
      </div>
    </div>
  );
}

const FreeTextSection = ({
  text,
  setText,
  placeholder,
  title,
}: {
  text: string;
  setText: any;
  title: string;
  placeholder?: string;
}) => {
  return (
    <div className="mt-4">
      <h4 className="font-bold text-lg">{title}</h4>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder={placeholder || "Text"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
      ></textarea>
    </div>
  );
};
