import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { AdventureService } from "../../app/services/adventure-service";

import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import { z } from "zod";
import { UserInfoAPIResponse } from "../../lib/definitions/user-info-api-response";
import { Adventure } from "../../lib/models/adventure.model";
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
  creating?: boolean;
  startDate: Date;
  endDate: Date;
  adventureData: Adventure;
  onSubmit?: (
    data: OccurrenceSubmissionData,
    {
      notes,
      description,
      startDate,
      endDate,
    }: {
      notes?: string;
      description?: string;
      title: string;
      startDate: Date;
      endDate: Date;
    }
  ) => void;
  onDeleteOccurrence?: (currentEventId: string) => void;
}

export function OccurrenceModal(props: OccurrenceModalProps) {
  /* 
  Travel occurrence state
  */
  const handleDataSubmit = (data: OccurrenceSubmissionData) => {
    setSubmitError(null);
    // We can use zod to validate the input

    const validationSchema = z
      .object({
        startDate: z.date().min(new Date(props.adventureData.startDate)),
        endDate: z.date().max(new Date(props.adventureData.endDate)),
      })
      .refine((data) => new Date(data.startDate) < new Date(data.endDate));

    const res = validationSchema.safeParse({ startDate, endDate });

    if (res.success === false) {
      setSubmitError(
        res.error.errors.map((e) => e.message).join("\n") || "Invalid dates"
      );
      return;
    }

    props.onSubmit &&
      props.onSubmit(data, {
        notes,
        description,
        title,
        startDate: startDate!,
        endDate: endDate!,
      });
  };

  const handleDeleteOccurrenceClicked = () => {
    props.onDeleteOccurrence && props.onDeleteOccurrence(props.currentEventId!);
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
              key={"travel-description"}
              setText={setDescription}
            />,
            <FreeTextSection
              title="Notes"
              text={notes}
              placeholder="Notes"
              key={"travel-notes"}
              setText={setNotes}
            />,

            <CommentsContainer
              comments={commentStack}
              onSubmit={handlePostComment}
              creating={props.creating}
              key={"travel-comments-container"}
            />,
            <DeleteOccurrenceButton
              creating={props.creating}
              onClicked={() => {
                setConfirmDeleteModalOpen(true);
              }}
              key={"travel-delete-button"}
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
              key={"accommodation-description"}
              setText={setDescription}
            />,
            <FreeTextSection
              title="Notes"
              text={notes}
              placeholder="Notes"
              key={"accommodation-notes"}
              setText={setNotes}
            />,
            <CommentsContainer
              comments={commentStack}
              onSubmit={handlePostComment}
              creating={props.creating}
              key={"accommodation-comments-container"}
            />,
            <DeleteOccurrenceButton
              creating={props.creating}
              onClicked={() => {
                setConfirmDeleteModalOpen(true);
              }}
              key={"accommodation-delete-button"}
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
              key={"activity-description"}
            />,
            <FreeTextSection
              title="Notes"
              text={notes}
              placeholder="Notes"
              setText={setNotes}
              key={"activity-notes"}
            />,
            <CommentsContainer
              comments={commentStack}
              onSubmit={handlePostComment}
              creating={props.creating}
              key={"activity-comments-container"}
            />,
            <DeleteOccurrenceButton
              creating={props.creating}
              onClicked={() => {
                setConfirmDeleteModalOpen(true);
              }}
              key={"activity-delete-button"}
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
              key={"food-description"}
            />,
            <FreeTextSection
              title="Notes"
              text={notes}
              placeholder="Notes"
              setText={setNotes}
              key={"food-notes"}
            />,
            <CommentsContainer
              comments={commentStack}
              onSubmit={handlePostComment}
              creating={props.creating}
              key={"food-comments-container"}
            />,

            <DeleteOccurrenceButton
              creating={props.creating}
              onClicked={() => {
                setConfirmDeleteModalOpen(true);
              }}
              key={"food-delete-button"}
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
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  // Dates for the occurrence
  const [startDate, setStartDate] = useState<Date | null>(
    props.startDate || null
  );
  const [endDate, setEndDate] = useState<Date | null>(props.endDate || null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
  ): Promise<Record<string, UserInfoAPIResponse>> => {
    // Extract the user ids from the comments and put them into a set

    const userIds = extractUserIds(occurrence);

    if (userIds.length === 0) return {};
    return AdventureService.getUserInfoByIds(userIds);
  };

  const extractUserIds = (occurrence: Occurrence): string[] => {
    return Array.from(
      new Set(occurrence.userComments!.map((comment) => comment.createdBy))
    );
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
      if (stack && stack.lastChild) {
        if ((stack.lastChild as any).scrollIntoView) {
          (stack.lastChild as any).scrollIntoView();
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [commentStack]);

  const renderCommentStack = (
    occurence: Occurrence,
    idNameDictionary: Record<string, UserInfoAPIResponse>
  ): StackerComment[] => {
    return occurence.userComments!.map((c) => {
      return {
        ...c,
        name: idNameDictionary[c.createdBy].name,
      };
    });
  };

  return (
    <div
      key={props.occurrenceType}
      className="absolute w-full top-[0] modal-container"
    >
      <div className="modal-box w-full max-w-[800px] lg:ml-[30%]">
        {/* Modal title */}
        <h3 className="font-bold text-2xl mb-4">{props.title}</h3>
        {/* Start end date section */}

        <div className="flex flex-col gap-y-2 pb-4">
          {/* Custom Datetime pickers go here to allow fine control of start-end dateTimes for an occurrrence */}
          <div>
            <h3>Start Time</h3>
            <DateTimePicker
              onChange={setStartDate}
              value={startDate}
              disabled={true}
            />
          </div>
          <div>
            <h3>EndTime</h3>
            <DateTimePicker onChange={setEndDate} value={endDate} />
          </div>
        </div>

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
        {submitError && (
          <p className="alert text-red-500 mt-4">{submitError}</p>
        )}
      </div>
      {confirmDeleteModalOpen && (
        <div className="absolute w-full top-[0] modal-container">
          <div className="modal-box w-full max-w-[800px] lg:ml-[30%] mt-[20vh]">
            <h3 className="font-bold text-2xl mb-4">Are you sure?</h3>
            <p className="mb-4">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-x-4">
              <button
                className="btn btn-error"
                onClick={() => {
                  handleDeleteOccurrenceClicked();
                }}
              >
                Delete
              </button>
              <button
                className="btn"
                onClick={() => setConfirmDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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

const DeleteOccurrenceButton = ({
  onClicked,
  creating,
}: {
  onClicked: () => void;
  creating?: boolean;
}) => {
  if (creating) return null;
  return (
    <div className="flex justify-center mt-4">
      <button
        className="text-red-600"
        onClick={() => {
          onClicked();
        }}
      >
        Delete event
      </button>
    </div>
  );
};
