import React, { Component } from "react";
import MyTrips from "../../pages/MyTrips";
import Http from "../../Http";
import { connect } from "react-redux";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import AlertModal from '../AlertModal';

class ParticipantList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteUserModal: false,
            loadUsers: false,
        }
        
        this.api = "/api/v1/";
    }
    openDeleteUserModal() {
        this.setState({
            deleteUserModal: true
        });
    }
    deleteUser(userId) {

        this.setState({
            deleteUserModal: false,
            loadUsers: true,
        });

        Http.delete(`{$this.api}`) 
        .then(response => {
            if(response.error == false) {
                this.loadUsers();
            }
        });
    }

    closeAlertModal() {
        this.setState({ deleteUserModal: false })
    }

    loadUsers() {
        Http.get();
    }

    render() {
        return this.props.participants.length
        ? (
        <div>

        { this.state.deleteUserModal && 
            <AlertModal
            show={this.state.deleteUserModal}
            execute={() => this.closeAlertModal()}
            onClose={() => this.closeAlertModal()}
            text={"Vai tiešām vēlaties dzēst doto lietotāju no braucienu saraksta?"}
            />
        }

        <Paper style={{ padding: "10px 10px", margin: "10px" }}>
        <h4>Dalībnieki</h4>
        { this.props.participants.map(participant => (
            <Grid key={participant.id} wrap="nowrap" container>
                <Grid item xs={11}>
                    {participant.name}
                </Grid>
                <Grid item xs={1}>
                    <Button color="secondary" onClick={() => this.openDeleteUserModal(participant.id)}>Noņemt</Button>
                </Grid>
            </Grid>
        )) 
        }
        </Paper>
        </div>
        ) : null;
    }
}


const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(ParticipantList);