"use client";
import dayjs from "dayjs";
import { Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { AdventureService } from "../../app/services/adventure-service";

interface AdventureSetupComponentProps {
  creating?: boolean;
  title: string;
  name?: string;
  description?: string;
  startDate?: Date;
  id?: string;
  endDate?: Date;
  onEventPatched?: () => void;
  creatorId?: string;
  onDeleteAdventure?: () => void;
}
export function AdventureSetupComponent({
  creating,
  title,
  name,
  description,
  startDate,
  endDate,
  id,
  onEventPatched,
  creatorId,
  onDeleteAdventure,
}: AdventureSetupComponentProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [dateRange, setDateRange] = useState<Record<string, Date>>({
    startDate: startDate || dayjs().toDate(),
    endDate: endDate || dayjs().add(7, "day").toDate(),
  });

  const [dateError, setDateError] = useState<string | null>(null);
  const [confirmDeleteAdventureModalOpen, setConfirmDeleteAdventureModalOpen] =
    useState<boolean>(false);

  const handleCalendarChange = (e: any, controlName: string) => {
    setDateError(null);
    // Validate so that the start date is before the end date
    if (controlName === "startDate" && e > dateRange.endDate) {
      setDateError("Start date must be before end date");
      return;
    }

    setDateRange((prev) => {
      return {
        ...prev,
        [controlName]: e,
      };
    });
  };

  const handleDeleteAdventure = async () => {
    // Create API request to delete the adventure
    onDeleteAdventure && onDeleteAdventure();
  };

  if (status === "unauthenticated") {
    // Only authenticated users can access this page
    router.replace("/signin");
    return null;
  }

  return (
    <div>
      <header>
        <h1 className="text-4xl mb-4">{title}</h1>
      </header>
      <div>
        <Formik
          initialValues={{
            name: name || "",
            description: description || "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            if (creating) {
              try {
                setSubmitting(true);

                // Call the service to create the adventure
                const res = await AdventureService.postCreateAdventure({
                  ...values,
                  startDate: dateRange.startDate,
                  endDate: dateRange.endDate,
                });

                // We will get the id of the new adventure.
                router.push(`/adventure/view/${res.id}`);
                return;
              } catch (error: any) {
                console.error(error);
                return;
              }
            }

            if (!id) return;
            try {
              setSubmitting(true);
              // Call the service to update the adventure
              await AdventureService.patchAdventureById(id, {
                ...values,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              });

              onEventPatched && onEventPatched();
            } catch (error: any) {
              console.error(error);
            }
          }}
          validate={(values) => {
            const errors: Record<string, string> = {};
            setDateError(null);
            if (!values.name) {
              errors.name = "Please give the adventure a name";
            }

            // Date
            if (dateRange.startDate > dateRange.endDate) {
              setDateError("Start date must be before end date");
              errors.startDate = "Start date must be before end date";
            }

            return errors;
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {/* TODO: we may want to factor the spinner out to its own component */}
              {isSubmitting && (
                <div className="z-[100] absolute w-full h-full backdrop-blur-sm">
                  <div className="ml-[50%] mt-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                </div>
              )}
              <div className="w-full flex flex-col gap-y-2">
                <input
                  className="input input-bordered w-full"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                  placeholder="Name"
                  maxLength={50}
                  disabled={isSubmitting}
                  onBlur={handleBlur}
                />
                <div className="text-orange-600">
                  {errors.name && touched.name && errors.name}
                </div>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  name="description"
                  onChange={handleChange}
                  value={values.description}
                  placeholder="Description"
                  maxLength={255}
                  disabled={isSubmitting}
                />
              </div>
              <div className="mt-4">
                {/* The section for picking a start and end date. These datepickers aren't compatible with Formik */}
                <div className="flex gap-x-6 gap-y-6 ml-8 flex-wrap">
                  <div>
                    <h4>Adventure starts:</h4>
                    <DatePicker
                      selected={dateRange.startDate}
                      onChange={(e) => handleCalendarChange(e, "startDate")}
                      name="startDate"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <h4>Adventure ends:</h4>
                    <DatePicker
                      selected={dateRange.endDate}
                      onChange={(e) => handleCalendarChange(e, "endDate")}
                      name="endDate"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                {dateError && (
                  <div className="text-orange-600">{dateError}</div>
                )}
              </div>
              <div className="mt-4 flex justify-center gap-4 flex-col">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {creating ? "Create" : "Update"}
                </button>
                {!creating && session?.user?._id === creatorId && (
                  <button
                    className="text-red-500"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setConfirmDeleteAdventureModalOpen(true);
                    }}
                  >
                    Delete Adventure
                  </button>
                )}
              </div>
              {isSubmitting && (
                <div className="flex justify-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              )}
            </form>
          )}
        </Formik>
      </div>
      {confirmDeleteAdventureModalOpen && (
        <div className="absolute top-[0] left-[0] modal-container">
          <div className="modal-box mt-[10vh]">
            <h3 className="font-bold text-2xl mb-4">Are you sure?</h3>
            <p className="mb-4">
              Do you want to delete this adventure? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-x-4">
              <button className="btn btn-error" onClick={handleDeleteAdventure}>
                Delete
              </button>
              <button
                className="btn"
                onClick={() => setConfirmDeleteAdventureModalOpen(false)}
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
