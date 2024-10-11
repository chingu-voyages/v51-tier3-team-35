import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { AdventureService } from "../../app/services/adventure-service";
import {
  AccommodationOccurrence,
  ActivityOccurrence,
  EventType,
  FoodOccurrence,
  Occurrence,
  TravelOccurrence,
} from "../../lib/models/occurrence.model";
import { accommodationOccurrence } from "./accommodation/Accommodation-occurence-modal";
import { activityOccurrenceModal } from "./activity/Activity-occurrence-modal";
import { OccurrenceSubmissionData } from "./definitions";
import { foodOccurrenceModal } from "./food/Food-occurrence-modal";
import { travelOccurrence } from "./travel/Travel-occurrence-modal";

interface OccurrenceModalProps {
  id: string;
  title: string;
  occurrenceType: EventType; // Events and occurrences are the same thing.
  adventureId: string;
  currentEventId?: string | null;
  onClose: () => void;
  onSubmit?: (
    data: OccurrenceSubmissionData,
    {
      notes,
      description,
    }: { notes?: string; description?: string; title: string }
  ) => void;
}

export function OccurrenceModal(props: OccurrenceModalProps) {
  /* 
  Travel occurrence state
  */
  const handleDataSubmit = (data: OccurrenceSubmissionData) => {
    props.onSubmit && props.onSubmit(data, { notes, description, title });
  };

  const getModalForEventType = (occurrenceType: EventType) => {
    switch (occurrenceType) {
      case "travel":
        return travelOccurrence(
          {
            onCloseModal: props.onClose,
            onSubmit: handleDataSubmit,
            existingEventData: existingEventData as TravelOccurrence,
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
            existingEventData: existingEventData as AccommodationOccurrence,
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
            existingEventData: existingEventData as ActivityOccurrence,
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
            existingEventData: existingEventData as FoodOccurrence,
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

  const [notes, setNotes] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [existingEventData, setExistingEventData] = useState<Occurrence | null>(
    null
  );

  useEffect(() => {
    const fetchExistingOccurrence = async () => {
      // Fetch the event data from the server
      const res = await AdventureService.getOccurrenceById(
        props.adventureId,
        props.currentEventId!
      );

      setTitle(res.title);
      setDescription(res.description || "");
      setNotes(res.notes || "");
      setExistingEventData(res);
    };
    if (props.currentEventId && props.adventureId) {
      fetchExistingOccurrence();
    }
  }, [props.currentEventId, props.adventureId]);

  return (
    <div
      key={props.occurrenceType}
      className={`absolute w-full top-[0] modal-container`}
    >
      <div className="modal-box w-full max-w-[800px] lg:ml-[30%]">
        {/* Modal title */}
        <h3 className="font-bold text-2xl mb-4">{props.title}</h3>
        <div>
          {/* Render a title input text field for all modal types */}
          <h4 className="font-bold text-lg">Title</h4>
          <input
            type="text"
            className="input input-bordered w-full mb-4"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>
        {/* Modal is rendered here depending on the occurrence type */}
        {getModalForEventType(props.occurrenceType)}
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
