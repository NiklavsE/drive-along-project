import React, { Component } from "react";
import MyTrips from "../pages/MyTrips";
import { connect } from "react-redux";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Http from "../Http";

class AddComment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tripId: this.props.tripId,
            value: '',
            error: false,
            errorText: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        // API endpoint.
        this.api = "/api/v1/comment";
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let data = this.state.value;

        if (data.length <= 10) { 
            this.setState({errorText: true});
        } else { 
            let trip = this.props.trip;

            const apiUrl = `${this.api}/${trip}`;
    
            Http.post(apiUrl, data)
            .then(response => {
                this.setState({
                    errorText: false,
                    value: ''
                });
                this.props.loadComments();
            })
            .catch(() => {
                this.setState({
                error: "Unable to fetch data."
                });
            });
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} >
                <Grid style={{ padding: "20px", margin: "10px" }} container wrap="nowrap">
                    <Grid item xs={10} style={{ align: "left" }}>
                        <TextField 
                        value={this.state.value} 
                        fullWidth={true} 
                        multiline={true} 
                        rows={2} 
                        id="outlined-basic" 
                        label="komentārs" 
                        variant="outlined" 
                        onChange={this.handleChange} 
                        error = {this.state.errorText}
                        helperText="Tekstam jāsatur vismaz 10 rakstzīmes"
                        />
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: "right" }}>
                        <Button type="submit"> Pievienot komentāru </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}


export default AddComment;






