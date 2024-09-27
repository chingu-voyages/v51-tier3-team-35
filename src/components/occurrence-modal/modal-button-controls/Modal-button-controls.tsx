export const ModalButtonControls = ({
  onSubmit,
  onCloseModal,
}: {
  onSubmit: () => void;
  onCloseModal: () => void;
}) => {
  return (
    <div className="modal-action">
      <form method="dialog">
        {/* Controls */}
        <div className="flex gap-x-4">
          <button className="btn btn-primary" onClick={onSubmit}>
            Save
          </button>
          <button className="btn" onClick={onCloseModal}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
