import React, { Component } from "react";
import ClipLoader from "react-spinners/ClipLoader";

class Spinner extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div
            style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <ClipLoader
                    size={50}
                    color={"#0066ff"}
                />
            </div>  
        );
    }
}

export default (Spinner);