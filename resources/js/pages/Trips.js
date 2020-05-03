import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AlertModal from '../components/AlertModal';
import JoinTripModal from '../components/JoinTripModal';
import Spinner from '../components/spinner/Spinner';
import RemoveTrip from '../components/buttons/RemoveTrip';
import  { Redirect } from 'react-router-dom';
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";

const useStyles = theme => ({
  root: {
    minWidth: 275,
    justify: 'center',
    margin: "20px",
    padding: "20px",
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 25,
  },
  pos: {
    marginBottom: 12,
    fontSize: 18,
  },
  button: {
    background: '#0066ff',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#0066ff',
      color: '#FFFFFF'
    },
    borderRadius: 25
  },
  ViewButton: {
    background: '#808080',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#808080',
      color: '#FFFFFF'
    },
    borderRadius: 25
  }
});


class Trips extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      trips: [],
      error: false,
      errorMessage: '',
      isJoinTripModalOpen: false,
      joinTripModalTripId: null,
      isLoadingData: true,
      joinTripStatus: '',
      redirectToTrip: false,
      redirectTripId: null,
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

  closeAlertModal = () => {
    this.setState({
      alertModalOpen: false,
      joinTripStatus: ''
    })
  }


  addPassenger = (key) => {

    this.closeJoinTripModal();

    this.setState({
      isLoadingData: true
    });

    let updatedTrips = this.state.trips;

    Http.post(`/api/v1/trip-passenger/${key}`)
      .then(response => {

        this.setState({
          isLoadingData: false
        });

        if (response.data.error == false) {
          updatedTrips.map(trip => {
            if (trip.id == key) {
              trip.passengerCount--;
            }
          });
          this.setState({
            trips: updatedTrips,
            joinTripStatus: response.data.status,
            alertModalOpen: true
          });
        } else {
          this.setState({
            joinTripStatus: response.data.status,
            alertModalOpen: true
          });
        }
      })
      .catch(() => {
        this.setState({
          error: "Sorry, there was an error joining a trip"
        });
      });
  }


  componentDidMount() {
    this.loadData();
  }

  loadData() { 
    this.setState({ isLoadingData: true });
    
    const { tripRoute } = this.props.location.state;

    Http.get(`${this.api}/${tripRoute}`)
    .then(response => {
      this.setState({
        trips: response.data.map(trip => ({
            startingPoint: trip.starting_point,
            destination: trip.destination,
            time: trip.time,
            id: trip.id,
            passengerCount: trip.passenger_count,
          })
        ),
        redirectToTrip: false,
        redirectTripId: null,
      })
      this.setState({isLoadingData: false})
    })
    .catch(() => {
      this.setState({
        error: "Unable to fetch data."
      });
    });
  }

  redirectToTrip(tripId) {
    this.setState({
      redirectToTrip: true,
      redirectTripId: tripId,
    });
  }


  render() {

    if (this.state.redirectToTrip) {  
      return <Redirect to={{ pathname: '/user-trip', state: { trip: this.state.redirectTripId } }}/>
    }

    const { classes } = this.props;
    const { trips, errorMessage } = this.state;

    return (
      <div>

        { this.state.joinTripStatus == 'trip full' && 
        <AlertModal
          show={this.state.alertModalOpen}
          execute={() => this.closeAlertModal()}
          onClose={() => this.closeAlertModal()}
          text={"Pasažieru skaita limits ir sasniegts!"}
        />
      }

      { this.state.joinTripStatus == 'success' && 
        <AlertModal
          show={this.state.alertModalOpen}
          execute={() => this.closeAlertModal()}
          onClose={() => this.closeAlertModal()}
        text={"Esat veiksmīgi pievienojies braucienam! Dodaties uz 'Mani braucieni' sadaļu, lai uzzinātu vairāk!"}
        />
      }

      { this.state.joinTripStatus == 'is already joined' && 
        <AlertModal
          show={this.state.alertModalOpen}
          execute={() => this.closeAlertModal()}
          onClose={() => this.closeAlertModal()}
          text={"Jūs jau esat pievienojies šim braucienam!"}
        />
      }

      { this.state.joinTripStatus == 'day limit' && 
        <AlertModal
        show={this.state.alertModalOpen}
        execute={() => this.closeAlertModal()}
        onClose={() => this.closeAlertModal()}
        text={"Dienas laikā Jūs drīkstat pievienoties tikai vienam braucienam un šī paša maršruta atpakaļceļam!"}
        />
      }

      {this.state.isLoadingData ? 
        (<Spinner />) : (
          
          trips.map(trip => (
          <Card className={classes.root} key = {trip.id}>
        
          { this.state.joinTripModalTripId == trip.id && 
            <JoinTripModal 
            show={this.state.isJoinTripModalOpen} 
            addPassenger={() => this.addPassenger(trip.id)}
            onClose={() => this.closeJoinTripModal()}
            />
          }

            <CardContent>
            <Grid container wrap="nowrap">
              <Grid item xs={9}>
                <Typography gutterBottom variant="h1" className={classes.title}>
                  {trip.startingPoint} - {trip.destination}
                </Typography>
                <Typography className={classes.pos}>
                  {trip.time }
                </Typography>
                <Typography variant="body2" component="p">
                  Šobrīd brīvās vietas: {trip.passengerCount}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Button  variant="contained" className={classes.button} onClick={() => this.openJoinTripModal(trip.id)}>
                + Pieteikties braucienam
                </Button>
              </Grid>
            </Grid>
            </CardContent>
          <CardActions> 
            { this.props.user.admin ? (<Button variant="contained" className={classes.ViewButton} onClick={() => this.redirectToTrip(trip.id)}>Skatīt</Button>) : null }
            { this.props.user.admin ? (<RemoveTrip trip={trip.id} reloadData={() => this.loadData()} />) : null }

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
