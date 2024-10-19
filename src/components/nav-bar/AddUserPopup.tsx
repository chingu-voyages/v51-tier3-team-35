import { ErrorMessage, Field, Form, Formik } from "formik";

interface Values {
  userEmail: string;
}

interface PopupProps {
  isPopupOpen: boolean;
  closePopup: () => void;
  onSubmit?: (values: Values) => void;
}

const AddUserPopup = ({ isPopupOpen, closePopup, onSubmit }: PopupProps) => {
  const validate = (values: Values) => {
    const errors: Partial<Values> = {};
    if (!values.userEmail) {
      errors.userEmail = "email is required";
    }
    return errors;
  };

  const handleSubmit = async (values: Values) => {
    onSubmit && onSubmit(values);
  };

  return (
    isPopupOpen && (
      <div className="absolute w-full top-[0] modal-container">
        <div className="modal-box lg:ml-[30%] mt-[40vh]">
          <h2 className="text-xl mb-4">Add Collaborator</h2>
          <Formik
            initialValues={{
              userEmail: "",
            }}
            onSubmit={handleSubmit}
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
                <button
                  type="button"
                  onClick={closePopup}
                  className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    )
  );
};

export default AddUserPopup;
