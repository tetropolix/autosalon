import React from 'react'
import { Alert } from '@material-ui/lab'
import classes from './ErrorAlert.module.css';

export default function ErrorAlert() {
    return (
        <div className={classes.div}>
            <Alert severity='error'>Something went wrong!</Alert>
        </div>
    )
}
