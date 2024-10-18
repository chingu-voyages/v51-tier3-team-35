import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AdventureService } from '../services/adventure-service';

    interface Values {
        userEmail: string;
    }

    interface PopupProps {
        isPopupOpen: boolean;
        closePopup: () => void;
        adventureId: string;
    }

const AddUserPopup = ({ isPopupOpen, closePopup, adventureId }: PopupProps) => {

    const validate = (values: Values) => {
        const errors: Partial<Values> = {};
        if (!values.userEmail) {
          errors.userEmail = 'email is required';
        }
        return errors;
      };

    const handleAddUser = async (values: Values) => {
        console.log("user Popup is working!")
        try {
            console.log("values being sent: ", values);
            console.log("adventureId is: ", adventureId);
            await AdventureService.addUserToAdventure(adventureId, values.userEmail)
        } catch (err) {
            console.error(err);
        } finally {     
            console.log("user add completed!");
            closePopup(); 
        }
    }

    return (
        isPopupOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl mb-4">Add User to Planner</h2>
                <Formik 
                initialValues={{
                    userEmail: "",
                }}
                onSubmit={handleAddUser}
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
                        <button type="button" onClick={closePopup} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button type="submit" 
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
    )
}

export default AddUserPopup;