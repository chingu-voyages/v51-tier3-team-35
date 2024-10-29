import dayjs from "dayjs";
import { useState } from "react";
import { StackerComment } from "../../lib/models/occurrence.model";

interface CommentsContainerProps {
  comments: StackerComment[];
  creating?: boolean;
  onSubmit: (comment: string) => void;
}
export function CommentsContainer({
  comments,
  onSubmit,
  creating,
}: CommentsContainerProps) {
  const [commentText, setCommentText] = useState("");
  if (creating) return null;

  return (
    <>
      <h4 className="font-bold text-xl mt-4">Comments</h4>
      <div className="p-2">
        <div
          id="comments-container"
          className={` ${
            comments?.length > 0 ? "h-[200px]" : ""
          } overflow-auto`}
        >
          {comments &&
            comments.map((comment) => (
              <Comment comment={comment} key={comment._id} />
            ))}
        </div>
        <div id="comments-maker" className="w-full flex gap-x-2 mt-2">
          <input
            type="text"
            placeholder="Type a comment here..."
            className="input input-bordered w-full"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={100}
          />
          <button
            className="btn btn-ghost"
            onClick={() => {
              onSubmit && onSubmit(commentText);
              setCommentText("");
            }}
          >
            Post
          </button>
        </div>
      </div>
    </>
  );
}

const Comment = ({ comment }: { comment: StackerComment }) => {
  return (
    <div className="flex flex-col p-2">
      <p className="font-bold italic">{comment.name} wrote:</p>
      <div className="flex justify-between">
        <p>{comment.text}</p>
        <p>{dayjs(comment.createdAt).format("MMM DD YYYY, HH:MM")}</p>
      </div>
    </div>
  );
};
