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

class ViewTrip extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      trip: [],
      error: false,
      errorMessage: '',
      isModalOpen: false,
      modalTripId: null,
      isLoadingData: true,
      isLoadingCommentList: false,
    };

    // API endpoint.
    this.api = "/api/v1/user-trip";
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() { 
    this.setState({
      isLoadingData: true,
    });

    let trip = this.props.location.state.trip;
    
    Http.get(`${this.api}/${trip}`)
    .then(response => {
      this.setState({
        trip: response.data[0]
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

    let updatedTrip = this.state.trip;

    Http.get(`api/v1/comments/${tripId}`)
    .then(response => {
        updatedTrip.comments = response.data.comments;

        this.setState({
          trip: updatedTrip,
          isLoadingCommentList: false,
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
    console.log(this.state.trip);
    const { trip, errorMessage } = this.state;

    return (
      <div>
      {this.state.isLoadingData ? 
        (<Spinner />) : (
          <Paper style={{ padding: "40px 20px", margin: "10px" }} key={trip.id}>

          <Grid container wrap="nowrap">
          <Grid item xs={10}>
          <h4 style={{ margin: 0, textAlign: "left" }}> {trip.starting_point} - {trip.destination} </h4>
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
            <CommentList comments={trip.comments} reloadComments={() => this.loadComments(trip.id)}/>
          )}
          <AddComment 
            trip={trip.id} 
            loadComments={() => this.loadComments(trip.id)}
          />
          </Paper>
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

export default connect(mapStateToProps)(ViewTrip);
