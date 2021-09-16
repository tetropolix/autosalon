import React from "react";
import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useState } from "react";
import CarCardEdit from "./CarCardEdit/CarCardEdit";
import CarCardContent from "./CarCardContent/CarCardContent";

const useStyles = makeStyles({
  card: {
    width: "40%",
    margin: 8,
    "&:hover": {
      cursor: "pointer",
      background: "rgba(0,0,0,0.15)",
    },
  },
  openedCard: {
    margin: "15px 0",
    border: "1px solid rgba(0,0,0,0.3)",
    position: "relative",
    width: "98%",
    minHeight: 300,
    maxHeight: 550,
    "&:hover": {
      background: "white",
    },
  },
  icon: {
    position: "absolute",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  content: {
    height: "100%",
  },
  closeIcon: {
    right: "15px",
    top: "15px",
  },
  deleteIcon: {
    right: "15px",
    bottom: "15px",
  },
  editIcon: {
    right: "60px",
    bottom: "15px",
  },
  "@media (max-width: 730px)": {
    card: {
      width: "80%",
    },
  },
});

export default function CarCard(props) {
  const classes = useStyles();
  const opened = props.opened;
  const [editMode, setEditMode] = useState(false);
  const { model, manufacturer, id } = props.car;
  return (
    <>
      {opened ? (
        <Card className={classes.openedCard}>
          <CardContent className={classes.content}>
            {opened && (
              <CloseIcon
                className={classes.closeIcon + " " + classes.icon}
                onClick={() => {
                  props.onClickHandler("");
                }}
              />
            )}
            {editMode ? (
              <CarCardEdit
                car={props.car}
                closeEdit={() => {
                  setEditMode(false);
                }}
                refetchAfterEdit={props.refetchAfterEdit}
              />
            ) : (
              <CarCardContent car={props.car} />
            )}
            {!editMode && (
              <EditIcon
                className={classes.editIcon + " " + classes.icon}
                onClick={() => setEditMode(true)}
              />
            )}
            <DeleteIcon
              className={classes.deleteIcon + " " + classes.icon}
              onClick={() => props.onDeleteHandler({ variables: { id } })}
            />
          </CardContent>
        </Card>
      ) : (
        <Card
          className={classes.card}
          onClick={() => {
            props.onClickHandler(id);
          }}
        >
          <CardContent>
            <Typography variant="h5">{model}</Typography>
            <Typography variant="body1">{manufacturer.name}</Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
