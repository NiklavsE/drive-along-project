import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter as Router, Link } from "react-router-dom";
import CommentList from "../components/CommentList";
import AddComment from "../components/AddComment";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import MyTripsModal from "../components/MyTripsModal"

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
      modalTripId: null
    };

    // API endpoint.
    this.api = "/api/v1/user-trips";
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
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
          })
        )
      })
    })
    .catch(() => {
      this.setState({
        error: "Unable to fetch data."
      });
    });
  }

  loadComments(tripId) {

    let updatedTrips = this.state.trips;

    Http.get(`api/v1/comments/${tripId}`)
    .then(response => {
      updatedTrips.map(trip => {
        if (trip.id == tripId) {
          trip.comments = response.data.comments;
        }

        this.setState({
          trips: updatedTrips
        })
      });
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
    Http.delete(`api/v1/user-trips/${tripId}`)
    .then(response => {
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
    return trips.length
    ? (
      trips.map(trip => (
        <Paper style={{ padding: "40px 20px", margin: "10px" }} key={trip.id}>
        
        { this.state.modalTripId == trip.id && 
          <MyTripsModal
            show={this.state.isModalOpen}
            execute={() => this.leaveTrip(trip.id)}
            onClose={() => this.closeModal()}
            text={"Suka ble"}
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
          Šobrīd brīvās vietas: {trip.passengerCount}
        </Grid>
        <Grid justifycontent="left" item xs zeroMinWidth>
        Komentāri:
        </Grid>
        <CommentList comments={trip.comments} />
        <AddComment trip={trip.id} loadComments={() => this.loadComments(trip.id)}/>
        </Paper>
      ))
    ) : null;
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(MyTrips);
