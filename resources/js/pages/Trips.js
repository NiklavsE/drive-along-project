import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter as Router, Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 200
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      trips: [],
      error: false,
      errorMessage: '',
    };

    // API endpoint.
    this.api = "/api/v1/trips";
  }

  addPassenger = (key) => {
    let updatedTrips = this.state.trips;
    Http.post(`/api/v1/tripPassenger/${key}`)
      .then(response => {
        if (response.data.error == false) {
          updatedTrips.map(trip => {
            if (trip.id == key) {
              trip.passangerCount--;
            }
          });
          this.setState({
            trips: updatedTrips
          });
        } else {
          this.setState({
            errorMessage: 'Trip passanger count limit reached!'
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
    const { trips, errorMessage } = this.state;
    return (
      trips.map(trip => (
          <Card className={this.props.classes} key = {trip.id} onClick={() => this.addPassenger(trip.id)}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {trip.startingPoint} - {trip.destination}
              </Typography>
              <Typography gutterBottom variant="h4" component="h2">
                {trip.time }
              </Typography>
              <Typography>
              Šobrīd brīvās vietas: {trip.passangerCount}
            </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(Dashboard);
