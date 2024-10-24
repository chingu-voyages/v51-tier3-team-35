import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { AdventureService } from "../../app/services/adventure-service";

import { useSession } from "next-auth/react";
import { VscChromeClose } from "react-icons/vsc";
import { UserInfoAPIResponse } from "../../lib/definitions/user-info-api-response";
import { Adventure } from "../../lib/models/adventure.model";

interface Values {
  userEmail: string;
}

interface Props {
  adventureId: string;
  closePopup: () => void;
}
export function CollaboratorsModal({ closePopup, adventureId }: Props) {
  const { data: session } = useSession();
  const [isBusy, setIsBusy] = useState(false);

  const [adventureContext, setAdventureContext] = useState<Adventure | null>(
    null
  );
  const [userMap, setUserMap] = useState<Record<string, UserInfoAPIResponse>>(
    {}
  );

  const [apiError, setApiError] = useState<string | null>(null);
  /* 
    This component will handle the network operations with the API.
  */
  const validate = useCallback((values: Values) => {
    const errors: Partial<Values> = {};
    if (!values.userEmail) {
      errors.userEmail = "email is required";
    }
    return errors;
  }, []);

  const handleAddParticipant = useCallback(async (values: Values) => {
    setApiError(null);
    try {
      await AdventureService.addUserToAdventure(adventureId, values.userEmail);

      // Refresh the adventure
      await fetchAdventure();
      values.userEmail = "";
    } catch (error: any) {
      // TODO:
      setApiError(error.message);
    }
  }, []);

  const handleRemoveParticipant = useCallback(async (_id: string) => {
    // Handle removing an individual participant
    setApiError(null);
    try {
      setIsBusy(true);
      await AdventureService.removeUserFromAdventure(adventureId, _id);
      await fetchAdventure(); // Refresh
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsBusy(false);
    }
  }, []);

  const handleRemoveAllParticipants = useCallback(async () => {
    setApiError(null);
    try {
      setIsBusy(true);
      await AdventureService.removeAllParticipants(adventureId);
      await fetchAdventure(); // Refresh
    } catch (error: any) {
      setApiError(error.message);
    }
  }, []);

  useEffect(() => {
    // Reload the adventure context
    fetchAdventure();
  }, []);

  const fetchAdventure = async () => {
    try {
      const res = await AdventureService.getAdventureById(adventureId);
      setAdventureContext(res);

      if (res.participants) {
        // Get the user map
        const uMap = await AdventureService.getUserInfoByIds(res.participants);
        setUserMap(uMap);
      }
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <div className="absolute w-full top-[0] modal-container">
      <div className="modal-box w-full max-w-[800px] lg:ml-[30%] h-[600px]">
        <div className="flex justify-end">
          <button onClick={() => closePopup()}>
            <VscChromeClose />
          </button>
        </div>
        <h3 className="font-bold text-2xl mb-4">Collaborators</h3>
        <div>
          {/* Add a collaborator section */}
          <h2 className="text-xl mb-4">Add Collaborator</h2>
          <Formik
            initialValues={{
              userEmail: "",
            }}
            onSubmit={handleAddParticipant}
            validate={validate}
          >
            <Form>
              <Field
                id="userEmail"
                name="userEmail"
                placeholder="Enter user's email"
                className="border p-2 w-full mb-4"
                required
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              <div className="flex justify-end">
                <button type="submit" className="text-white px-4 py-2">
                  Add
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        <div>
          {/* Current collaborators section */}
          <h2 className="text-xl mb-4">Current Collaborators</h2>
          <div className="flex justify-end pt-2 pb-2">
            <button
              className="text-red-600 font-bold"
              onClick={handleRemoveAllParticipants}
              disabled={isBusy}
            >
              Remove All
            </button>
          </div>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {adventureContext?.participants.map((participant, index) => (
              <CollaboratorCard
                key={participant}
                _id={participant}
                displayName={`${index + 1}. ${userMap[participant]?.name}`}
                emailAddress={userMap[participant]?.email}
                onRemove={handleRemoveParticipant}
                ownerId={session?.user?._id!}
                isBusy={isBusy}
              />
            ))}
          </div>
          {apiError && <p className="alert text-red-500">{apiError}</p>}
        </div>
      </div>
    </div>
  );
}

const CollaboratorCard = ({
  _id,
  displayName,
  emailAddress,
  onRemove,
  isBusy,
  ownerId,
}: {
  _id: string;
  displayName: string;
  emailAddress: string;
  onRemove?: (_id: string) => void;
  isBusy?: boolean;
  ownerId: string;
}) => {
  return (
    <div
      className="card bg-base-100 shadow-xl !w-full !flex"
      style={{ boxShadow: "none", padding: "2px" }}
    >
      <div
        className="card-body !flex !justify-evenly !w-full !flex-row"
        style={{ padding: "0" }}
      >
        <p>
          {displayName} {_id === ownerId && "(owner)"}
        </p>
        {_id !== ownerId && <p>{emailAddress}</p>}
        {_id !== ownerId && (
          <button
            className="text-red-600"
            disabled={isBusy}
            onClick={() => {
              onRemove && onRemove(_id);
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
