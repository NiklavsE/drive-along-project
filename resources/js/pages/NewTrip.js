import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Divider, Avatar, Grid, Paper, TextField } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import MyTripsModal from "../components/MyTripsModal";
import { DateTimePicker , MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Select from 'react-select';
import Pace from 'react-pace-progress';

const useStyles = makeStyles({
  root: {
    maxWidth: 200
  },
});

class NewTrip extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      isLoadingRoutes: true,
      routes: [],
      StartingPoint: '',
      Destination: '',
      PassengerCount: '',
      Time: new Date(Date.now()),
      Route: '',
      StartingPointError: false,
      DestinationError: false,
      PassengerCountError: false,
      TimeError: false,
      RouteError: false,
      StartingPointErrorText: '',
      DestinationErrorText: '',
      PassengerCountErrorText: '',
      TimeErrorText: '',
      RouteErrorText: '',
      error: false,
      errorMessage: '',
      isModalOpen: false,
      saveFailed: null,
      isSavingForm: false
    };

    // API endpoint.
    this.api = "/api/v1/user-trip";

    this.RoutesApi = "/api/v1/routes";

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    this.fetchRoutes();
  }

  handleChange(event) { 
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSelectChange (value) {
    this.setState({
      Route: value
    })
  }

  handleDateChange (date) {
    this.setState({
      Time: date.format("YYYY/MM/D HH:mm:ss")
    })
    
  }

  fetchRoutes() {
    Http.get(`${this.RoutesApi}`)
    .then(response => {
      const { data } = response.data;
      this.setState({
        routes: data.map(route => ({
          label: route.from + ' - ' + route.to,
          value: route.id
        })  
        )
      })
      this.setState({isLoadingRoutes: false});
    })
    .catch(() => {
      this.setState({
        RoutesFetchError: "Unable to fetch data."
      });
    });
  }

  handleSubmit() {
    this.setState({
      isModalOpen: false,
      isSavingForm: true,
      saveFailed: null,
      StartingPointError: false,
      DestinationError: false,
      TimeError: false,
      PassengerCountError: false,
      RouteError: false
    })

    let invalidForm = false;

    let startingPoint = this.state.StartingPoint.trim();
    if (startingPoint.length < 5) {
      this.setState({
        StartingPointError: true
      })
      invalidForm = true;
    }

    let destination = this.state.Destination.trim();
    if (destination.length < 5) {
      this.setState({
        DestinationError: true
      })
      invalidForm = true;
    }

    let passengerCount = this.state.PassengerCount.trim();
    if (passengerCount.length > 3 && passengerCount < 1 && passengerCount == '') {
      this.setState({
        PassengerCountError: true
      })
      invalidForm = true;
    }

    let route = this.state.Route;

    if (route == '') {
      this.setState({
        RouteError: true
      })
      invalidForm = true;
    } else {
      route = route.value;
    }

    let time = this.state.Time;

    if (invalidForm == false) { 
      let data = {
        starting_point: startingPoint,
        destination: destination,
        passenger_count: passengerCount,
        time: time,
        route: route
      }
        
      Http.post(this.api, data)
        .then(response => {
          if (response.data.error == false) {
            this.setState({
              saveFailed: false,
              isSavingForm: false,
              StartingPoint: '',
              Destination: '',
              Time: new Date(Date.now()),
              Route: '',
              PassengerCount: ''
            });
          } else {
            this.setState({
              saveFailed: true,
              isSavingForm: false
            })
          }

        })
        .catch(() => {
            this.setState({
            error: "Unable to fetch data."
            });
      });

    } else {
      this.setState({
        isSavingForm: false
      })
    }
  }

  openModal(event) {
    event.preventDefault();

    this.setState({
      isModalOpen: true,
    })
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
    })
  }

  render() {
      return (
        <form onSubmit={() => this.openModal(event)}>
          <Paper style={{ padding: "40px 20px", margin: "10px" }}>
          { this.state.isSavingForm == true && <Pace color="#0066ff"/> }
          { this.state.saveFailed === true && <Alert severity="error">Brauciens netika saglabāts!</Alert> }
          { this.state.saveFailed === false && <Alert severity="success">Brauciens veiksmīgi saglabāts!</Alert> }

            { this.state.isModalOpen == true && 
              <MyTripsModal
              text={"Vai tiešām vēlaties pievienot šo braucienu?"}
              execute={() => this.handleSubmit()}
              onClose={() => this.closeModal()}
              show={this.state.isModalOpen}
            />
            }

          <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}>
            <h2>Brauciena izveidošana</h2>
          </Grid>

          <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}>
          <TextField 
              name="StartingPoint"
              value={this.state.StartingPoint} 
              fullWidth={true} 
              id="outlined-basic" 
              label="Sākumpunkts" 
              variant="outlined" 
              onChange={this.handleChange} 
              error = {this.state.StartingPointError}
              helperText="Tekstam jāsatur vismaz 5 rakstzīmes"
          />
          </Grid>
          <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}> 
          <TextField 
              name="Destination"
              value={this.state.Destination} 
              fullWidth={true} 
              id="outlined-basic" 
              label="Galamērķis" 
              variant="outlined" 
              onChange={this.handleChange} 
              error = {this.state.DestinationError}
              helperText="Tekstam jāsatur vismaz 10 rakstzīmes"
          />
          </Grid>
          <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}> 
          <TextField 
              name="PassengerCount"
              type="number"
              value={this.state.PassengerCount} 
              fullWidth={true} 
              id="outlined-basic" 
              label="Pasažieru skaits" 
              variant="outlined" 
              onChange={this.handleChange} 
              error = {this.state.PassengerCountError}
              helperText="Pasažieru skaitam ir jābūt skaitlim no 1 līdz 10"
          />
          </Grid>

          <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}> 
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              name="Time"
              autoOk
              ampm={false}
              value={this.state.Time}
              onChange={this.handleDateChange}
              label="Izbraukšanas laiks"
              disablePast
            />
          </MuiPickersUtilsProvider>
          
          </Grid>
          <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}> 
          <div style={{width: '100%'}}>
          <Select
            name="Route"
            value={this.state.Route }
            isLoading = { this.state.isLoadingRoutes }
            options={this.state.routes}  
            onChange={this.handleSelectChange}                
          />
          </div>
          </Grid>
          <Grid container justify="flex-end">
              <Button color="primary" type="submit">Saglabāt</Button>
          </Grid>
          </Paper>
        </form>
      )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(NewTrip);
