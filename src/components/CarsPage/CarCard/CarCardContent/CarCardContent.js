import React from "react";
import classes from './CarCardContent.module.css';
import { Typography } from "@material-ui/core";

export default function CarCardContent(props) {
  const { model, manufacturer, year, description } = props.car;
  return (
    <div className={classes.CarCardContent}>
      <Typography variant="h4">{model}</Typography>
      <Typography variant="subtitle1">{manufacturer.name}</Typography>
      <Typography variant="subtitle1">{manufacturer.headquarters}</Typography>
      <Typography variant="subtitle2">Model year - {year}</Typography>
      {(
        <Typography variant='body1' className={classes.description}>
          {description ?  description : <span className={classes.noDesc}>No description provided</span>}
        </Typography>
      )}
    </div>
  );
}
