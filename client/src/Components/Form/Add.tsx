import React, { useRef } from "react";
import { useAppDispatch } from "../../store/store";
import { addPerson } from "../../store/Person/personSlice";

const Add = () => {
  const name = useRef<string>("");
  const dispatch = useAppDispatch();

  return (
    <form>
      <label htmlFor=""> Person Name:</label>
      <input
        className="border rounded-md p-2 mx-2"
        onChange={(e) => (name.current = e.target.value)}
      />
      <button onClick={() => dispatch(addPerson({ name: name.current }))}>
        Add
      </button>
    </form>
  );
};

export default Add;
