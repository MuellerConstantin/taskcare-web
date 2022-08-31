import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChangeBoardNameForm from "./ChangeBoardNameForm";
import ChangeBoardDescriptionForm from "./ChangeBoardDescriptionForm";
import DeleteBoardForm from "./DeleteBoardForm";
import { fetchBoard } from "../../../store/slices/board";

export default function BoardSettingsView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { board } = useSelector((state) => state.board, shallowEqual);

  return (
    <div className="space-y-8">
      <ChangeBoardNameForm
        boardId={board.id}
        currentName={board?.name}
        onChange={() => dispatch(fetchBoard(board.id))}
      />
      <ChangeBoardDescriptionForm
        boardId={board.id}
        currentDescription={board?.description}
        onChange={() => dispatch(fetchBoard(board.id))}
      />
      <DeleteBoardForm
        boardId={board.id}
        onChange={() => navigate("/overview")}
      />
    </div>
  );
}
