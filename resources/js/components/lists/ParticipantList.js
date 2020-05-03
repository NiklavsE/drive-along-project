import React, { Component } from "react";
import MyTrips from "../../pages/MyTrips";
import Http from "../../Http";
import { connect } from "react-redux";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import AlertModal from '../AlertModal';
import ClipLoader from "react-spinners/ClipLoader";
import { withStyles } from "@material-ui/core/styles";

const useStyles = theme => ({
    deleteButton: {
      background: 'red',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: 'red',
        color: '#FFFFFF'
      },
      borderRadius: 25
    }
  });

class ParticipantList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteUserModal: false,
            loadUsers: false,
            deleteUser: null,
            participants: [],
            tripId: this.props.trip
        }
        
        this.api = "/api/v1/trip-passenger";
    }

    componentDidMount() {
        this.setState({ loadUsers: true });
        this.loadUsers();
    }

    openDeleteUserModal(id) {
        this.setState({
            deleteUserModal: true,
            deleteUser: id,
        });
    }
    deleteUser(userId) {

        this.setState({
            deleteUserModal: false,
            loadUsers: true,
        });

        Http.delete(`${this.api}/${userId}`) 
        .then(response => {
            if(response.data.error == false) {
                this.loadUsers();
            }
        });

        this.setState({ deleteUser: null });
    }

    closeAlertModal() {
        this.setState({ deleteUserModal: false })
    }

    loadUsers() {
        Http.get(`${this.api}/${this.state.tripId}`)
        .then(response => {
            if (response.data.error == false) {
                this.setState({
                    loadUsers: false,
                    participants: response.data.participants
                });
            }
        })
    }

    render() {
        const { classes } = this.props;
        return (
        <div>

        { this.state.deleteUserModal && 
            <AlertModal
            show={this.state.deleteUserModal}
            execute={() => this.deleteUser(this.state.deleteUser)}
            onClose={() => this.closeAlertModal()}
            text={"Vai tiešām vēlaties dzēst doto lietotāju no braucienu saraksta?"}
            />
        }


        <Paper style={{ padding: "10px 10px", margin: "10px" }}>
        <h4>Citi dalībnieki</h4>
        
        { this.state.loadUsers &&
            <ClipLoader 
                size={50}
                color={"#0066ff"}
            />
        }
        {(this.state.participants.length == 0 && this.state.loadUsers == false ) ? ("Šobrīd nav neviena dalībnieka!") : null }

        { this.state.participants.map(participant => (
            <Paper style={{ padding: "10px 10px", margin: "10px" }} key={participant.id}>
            <Grid wrap="nowrap" container>
                <Grid item xs={11}>
                    {participant.name}
                </Grid>
                <Grid item xs={1}>
                    <Button className={classes.deleteButton} onClick={() => this.openDeleteUserModal(participant.id)}>Noņemt</Button>
                </Grid>
            </Grid>
            </Paper>
        )) 
        }
        </Paper>
        </div>
        );
    }
}


const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(withStyles(useStyles)(ParticipantList));