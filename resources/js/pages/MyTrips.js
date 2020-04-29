import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Link } from "react-router-dom";
import CommentList from "../components/CommentList";
import AddComment from "../components/AddComment";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import MyTripsModal from "../components/MyTripsModal"
import Spinner from "../components/spinner/Spinner";
import ClipLoader from "react-spinners/ClipLoader";
import ParticipantList from "../components/lists/ParticipantList";

const useStyles = makeStyles({
  root: {
    maxWidth: 200
  },
});

class MyTrips extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      trips: [],
      error: false,
      errorMessage: '',
      isModalOpen: false,
      modalTripId: null,
      isLoadingData: true,
      isLoadingCommentList: false,
    };

    // API endpoint.
    this.api = "/api/v1/user-trips";
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() { 
    this.setState({
      isLoadingData: true,
    });
    
    Http.get(`${this.api}`)
    .then(response => {
      this.setState({
        trips: response.data.map(trip => ({
            startingPoint: trip.starting_point,
            destination: trip.destination,
            time: trip.time,
            id: trip.id,
            passengerCount: trip.passenger_count,
            driver: trip.driver,
            comments: trip.comments,
            participants: trip.participants
          })
        )
      });

      this.setState({
        isLoadingData: false
      });

    })
    .catch(() => {
      this.setState({
        error: "Unable to fetch data."
      });
    });
  }

  loadComments(tripId) {

    this.setState({
      isLoadingCommentList: true
    });

    let updatedTrips = this.state.trips;

    Http.get(`api/v1/comments/${tripId}`)
    .then(response => {
      updatedTrips.map(trip => {
        if (trip.id == tripId) {
          trip.comments = response.data.comments;
        }

        this.setState({
          trips: updatedTrips,
          isLoadingCommentList: false,
        })
      })
    })
    .catch(() => {
      this.setState({
        error: "Unable to fetch data."
      });
    });
  }

  openModal = (tripId) => {
    this.setState({
      isModalOpen: true,
      modalTripId: tripId
    });
  }

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      modalTripId: null
    });
  }

  leaveTrip = (tripId) => {
    this.setState({
      isLoadingData: true,
    });

    Http.delete(`api/v1/user-trips/${tripId}`)
    .then(response => {
      this.setState({
        isLoadingData: false,
      });

      this.loadData();
    })
    .catch(() => {
      this.setState({
        error: "Unable to fetch data."
      });
    });
  }

  render() {
    const { trips, errorMessage } = this.state;

    return (
      <div>
      {this.state.isLoadingData ? 
        (<Spinner />) : (
          trips.map(trip => (
          <Paper style={{ padding: "40px 20px", margin: "10px" }} key={trip.id}>

          { this.state.modalTripId == trip.id && 
          <MyTripsModal
          show={this.state.isModalOpen}
          execute={() => this.leaveTrip(trip.id)}
          onClose={() => this.closeModal()}
          text={"Vai tiešām vēlaties atteikties no dotā brauciena?"}
          />
          }

          <Grid container wrap="nowrap">
          <Grid item xs={10}>
          <h4 style={{ margin: 0, textAlign: "left" }}> {trip.startingPoint} - {trip.destination} </h4>
          </Grid>
            <Grid item xs={2} style={{ align: "right" }}>
              <Button color="secondary" onClick={() => this.openModal(trip.id)}> Atteikties no brauciena </Button>
            </Grid>
          </Grid>
          <Grid justifycontent="left" item xs zeroMinWidth>
            <ParticipantList trip={trip.id} />
          </Grid>
          <Grid justifycontent="left" item xs zeroMinWidth>
          Šobrīd brīvās vietas: {trip.passengerCount}
          </Grid>
          <Grid justifycontent="center" item xs zeroMinWidth>
          Komentāri:
          </Grid>
          {this.state.isLoadingCommentList ? 
            (<ClipLoader
              size={50}
              color={"#0066ff"}
          />) : (
            <CommentList comments={trip.comments} />
          )}
          <AddComment 
            trip={trip.id} 
            loadComments={() => this.loadComments(trip.id)}
          />
          </Paper>
          ))
        )
      }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(MyTrips);
