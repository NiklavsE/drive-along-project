import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Pace from 'react-pace-progress'

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import JoinTripModal from '../components/JoinTripModal';

const useStyles = theme => ({
  root: {
    minWidth: 275,
    justify: 'center',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


class Trips extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      trips: [],
      error: false,
      errorMessage: '',
      tripFullId: null,
      isalreadyJoinedId: null,
      successId: null,
      alreadyJoinedErrorId: null,
      isJoinTripModalOpen: false,
      joinTripModalTripId: null,
      isLoadingTrips: true,
    };

    // API endpoint.
    this.api = "/api/v1/trips";
  }

  openJoinTripModal = (tripId) => {
    this.setState({
      isJoinTripModalOpen: true,
      joinTripModalTripId: tripId
    });
  }

  closeJoinTripModal = () => {
    this.setState({
      isJoinTripModalOpen: false,
      joinTripModalTripId: null
    });
  }


  addPassenger = (key) => {
    let updatedTrips = this.state.trips;
    Http.post(`/api/v1/trip-passenger/${key}`)
      .then(response => {
        if (response.data.error == false) {
          updatedTrips.map(trip => {
            if (trip.id == key) {
              trip.passengerCount--;
            }
          });
          this.setState({
            trips: updatedTrips,
            successId: response.data.success,
            isalreadyJoined: null,
            tripFullId: null
          });
          this.closeJoinTripModal();
        } else {
          if (response.data.tripFull != '') {
            this.setState({
              tripFullId: response.data.tripFull,
              successId: null,
              isalreadyJoined: null
            });
          } else if (response.data.isalreadyJoined != '') { 
            this.setState({
              tripFullId: null,
              successId: null,
              isalreadyJoinedId: response.data.isalreadyJoined
            });
          }
          this.closeJoinTripModal();
        }
      })
      .catch(() => {
        this.setState({
          error: "Sorry, there was an error joining a trip"
        });
      });
  }


  componentDidMount() {
    const { tripRoute } = this.props.location.state;
    
    Http.get(`${this.api}/${tripRoute}`)
      .then(response => {
        this.setState({
          trips: response.data.map(trip => ({
              startingPoint: trip.starting_point,
              destination: trip.destination,
              time: trip.time,
              id: trip.id,
              passengerCount: trip.passenger_count
            })
          )
        })
        this.setState({isLoadingTrips: false})
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  }

  render() {

    const { classes } = this.props;
    const { trips, errorMessage } = this.state;
    const { isLoadingTrips } = this.state

    return (
      <div>
      {this.state.isLoadingTrips ? 
        (<Pace color="#0066ff"/>) : (
          trips.map(trip => (
          <Card className={classes.root} key = {trip.id}>
          
          { this.state.tripFullId == trip.id && <Alert severity="error">Pasažieru skaita limits ir sasniegts!</Alert> }
          { this.state.successId == trip.id && <Alert severity="success">Esat veiksmīgi pievienojies braucienam! Dodaties uz "Mani braucieni" sadaļu, lai uzzinātu vairāk!</Alert> }
          { this.state.isalreadyJoinedId == trip.id && <Alert severity="error">Jūs jau esat pievienojies šim braucienam!</Alert> }

          { this.state.joinTripModalTripId == trip.id && 
            <JoinTripModal 
            show={this.state.isJoinTripModalOpen} 
            addPassenger={() => this.addPassenger(trip.id)}
            onClose={() => this.closeJoinTripModal()}
            />
          }

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
                {trip.startingPoint} - {trip.destination}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {trip.time }
              </Typography>
              <Typography variant="body2" component="p">
              Šobrīd brīvās vietas: {trip.passengerCount}
            </Typography>
            </CardContent>
          <CardActions> 
            <Button onClick={() => this.openJoinTripModal(trip.id)}>
            Pieteikties braucienam
            </Button>
        </CardActions>
        </Card>
      ))
    )}
    </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(withStyles(useStyles)(Trips));
