import React from 'react'
import classes from './Loader.module.css';

export default function Loader() {
    return (
        <div className={classes.center}>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
            <div className={classes.wave}></div>
        </div>
    )
}
