import { MdDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ListTasks(props) {
  const list = props.tasksList;
  const [inputText, setInputText] = useState("");
  console.info(list)

  return (
    <div className="container mt-5">
      {props.tasksList.length > 0 && (
        <div className="row justify-content-center mb-3">
          <div className="col-3 mt-3 align-self-end">
            <input
              type="text"
              className="form-control py-2"
              placeholder="Search"
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>
      )}
      <DragDropContext
        onDragEnd={(param) => {
          if (!param.destination) return;

          const srcI = param.source.index;
          const desI = param.destination.index;
          if (desI) {
            list.splice(desI, 0, list.splice(srcI, 1)[0]);
            props.setTask({ tasks: list });
          }
        }}
      >
        <ul className="list-group align-items-center">
          <Droppable droppableId="droppable-1">
            {(provided, _) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{width: "50%"}}>
                {props.tasksList
                  .filter((task) =>
                    task.text.toLowerCase().includes(inputText.toLowerCase())
                  )
                  .map((element, i) => (
                    <Draggable
                      key={(element.id).toString()}
                      draggableId={"draggable-" + (element.id).toString()}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging
                              ? "0 0 .4rem #666"
                              : "none",
                          }}
                          className="list-group-item mb-2 rounded"
                        >
                          <div className="row justify-content-between">
                            <div className="col-9">
                              {element.strike ? (
                                <p className="vertical-center">
                                  <del><b>{element.text}</b></del>
                                </p>
                              ) : (
                                <p className="vertical-center">
                                  <b>{element.text}</b>
                                </p>
                              )}
                            </div>
                            <div className="col-3 px-0">
                              <button
                                className="btn btn-primary"
                                style={{
                                  height: "fit-content",
                                  marginRight: "10px",
                                }}
                                value={element.id}
                                onClick={(e) =>
                                  props.strikeTaskCallback(element.id)
                                }
                              >
                                <MdDone />
                              </button>
                              <button
                                className="btn btn-danger"
                                style={{ height: "fit-content" }}
                                value={element.id}
                                onClick={(e) =>
                                  props.removeTaskCallback(element.id)
                                }
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ul>
      </DragDropContext>
    </div>
  );
}
