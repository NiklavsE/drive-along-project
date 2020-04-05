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
      errorId: '',
      successId: '',
      isJoinTripModalOpen: false,
      joinTripModalTripId: null,
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
              trip.passangerCount--;
            }
          });
          this.setState({
            trips: updatedTrips,
            successId: response.data.success_id,
            errorId: '',
          });
        } else {
          this.setState({
            errorMessage: 'Trip passanger count limit reached!',
            errorId: response.data.error_id,
            successId: '',
          });
        }
      })
      .catch(() => {
        this.setState({
          error: "Sorry, there was an error joining a trip"
        });
      });
      this.closeJoinTripModal();
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
              passangerCount: trip.passanger_count
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

  render() {
    const { classes } = this.props;
    const { trips, errorMessage } = this.state;

    return (
      trips.map(trip => (
          <Card className={classes.root} key = {trip.id}>

          
          { this.state.errorId == trip.id && <Alert severity="error">Pasažieru skaita limits ir sasniegts!</Alert> }
          { this.state.successId == trip.id && <Alert severity="success">Esat veiksmīgi pievienojies braucienam! Dodaties uz "Mani braucieni" sadaļu, lai uzzinātu vairāk!</Alert> }

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
              Šobrīd brīvās vietas: {trip.passangerCount}
            </Typography>
            </CardContent>
          <CardActions> 
            <Button onClick={() => this.openJoinTripModal(trip.id)}>
            Pieteikties braucienam
            </Button>
        </CardActions>
        </Card>
      ))
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(withStyles(useStyles)(Trips));
