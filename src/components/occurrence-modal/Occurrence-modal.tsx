import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { AdventureService } from "../../app/services/adventure-service";
import { fetchUserProfile } from "../../app/services/userService";
import {
  AccommodationOccurrence,
  ActivityOccurrence,
  EventType,
  FoodOccurrence,
  Occurrence,
  StackerComment,
  TravelOccurrence,
} from "../../lib/models/occurrence.model";
import { CommentsContainer } from "../comment-components/Comment-stacker";
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
            <CommentsContainer
              comments={commentStack}
              onSubmit={handlePostComment}
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
            <CommentsContainer
              comments={commentStack}
              onSubmit={handlePostComment}
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
            <CommentsContainer
              comments={commentStack}
              onSubmit={handlePostComment}
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
            <CommentsContainer
              comments={commentStack}
              onSubmit={handlePostComment}
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
  const [commentStack, setCommentStack] = useState<StackerComment[]>([]);

  const handlePostComment = async (comment: string) => {
    try {
      await AdventureService.putComment(
        props.adventureId,
        props.currentEventId!,
        comment
      );
      await fetchExistingOccurrence();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchUserNames = async (
    occurrence: Occurrence
  ): Promise<Record<string, string>> => {
    const idNameDictionary = {} as Record<string, string>;

    const res = await Promise.allSettled(
      occurrence.userComments!.map((c) => fetchUserProfile(c.createdBy))
    );

    res.forEach((r) => {
      if (r.status === "fulfilled" && r.value) {
        const rId: string = r.value._id as string;
        idNameDictionary[rId] = r.value.name as string;
      }
    });
    return idNameDictionary;
  };

  useEffect(() => {
    if (props.currentEventId && props.adventureId) {
      fetchExistingOccurrence();
    }
  }, [props.currentEventId, props.adventureId]);

  const fetchExistingOccurrence = async () => {
    // Fetch the event data from the server
    const res = await AdventureService.getOccurrenceById(
      props.adventureId,
      props.currentEventId!
    );

    setTitle(res.title);
    setDescription(res.description || "");
    setNotes(res.notes || "");
    const userNameIdDict = await fetchUserNames(res);
    setExistingEventData(res);
    setCommentStack(renderCommentStack(res, userNameIdDict));
  };

  // This is used to scroll the comments container to the bottom when a new comment is added
  useEffect(() => {
    const timer = setTimeout(() => {
      const stack = document.getElementById("comments-container");
      if (stack) {
        if ((stack.lastChild as any).scrollIntoView) {
          (stack.lastChild as any).scrollIntoView();
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [commentStack]);

  const renderCommentStack = (
    occurence: Occurrence,
    idNameDictionary: Record<string, string>
  ): StackerComment[] => {
    return occurence.userComments!.map((c) => {
      return {
        ...c,
        name: idNameDictionary[c.createdBy],
      };
    });
  };
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
