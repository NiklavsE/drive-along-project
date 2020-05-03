import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Divider, Avatar, Grid, Paper, TextField } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import MyTripsModal from "../components/MyTripsModal";
import { DateTimePicker , MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Select from 'react-select';
import Spinner from "../components/spinner/Spinner";
import AlertModal from "../components/AlertModal";
import  { Redirect } from 'react-router-dom';

const useStyles = theme => ({
  root: {
    maxWidth: 200
  },
  button: {
    background: '#0066ff',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#0066ff',
      color: '#FFFFFF'
    },
    borderRadius: 25
  }
});

class NewRoute extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
        from: "",
        to: ""
    };

    this.api = "/api/v1/route";

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoadingData: true
    });

    setTimeout(() => {
      this.setState({
        isLoadingData: false
      })
      },
      1500
    );
  }

  handleChange(event) { 
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit() {
    this.setState({
      isModalOpen: false,
      isLoadingData: true,
      saveFailed: null,
      fromError: false,
      toError: false,
    });

    let invalidForm = false;

    let from = this.state.from.trim();
    if (from.length < 2) {
      this.setState({
        fromError: true
      })
      invalidForm = true;
    }

    let to = this.state.to.trim();
    if (to.length < 2) {
      this.setState({
        toError: true
      })
      invalidForm = true;
    }

    if (invalidForm == false) { 
      let data = {
        from: from,
        to: to,
      }
        
      Http.post(this.api, data)
        .then(response => {
          if (response.data.errors == false) {
            this.setState({ 
              saveFailed: false,
              from: '',
              to: '',
              isAlertModalOpen: true,
              isLoadingData: false,
            });
          } else {
            this.setState({
              saveFailed: true,
              isLoadingData: false,
              isAlertModalOpen: true,
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
        isLoadingData: false
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
  
  closeAlertModal() {
    this.setState({
      isAlertModalOpen: false,
    })
  }

  render() {
    const { classes } = this.props;
      return (
        <div>
        {this.state.isLoadingData ? 
          (<Spinner />) : 
          (
            <form onSubmit={() => this.openModal(event)}>
            <Paper style={{ padding: "40px 20px", margin: "10px" }}>

            { this.state.saveFailed === true && 
              <AlertModal
              show={this.state.isAlertModalOpen}
              execute={() => this.closeAlertModal()}
              onClose={() => this.closeAlertModal()}
              text={"Maršruts netika izveidots! :("}
              />
            }

            { this.state.saveFailed === false && 
              <AlertModal
              show={this.state.isAlertModalOpen}
              execute={() => this.closeAlertModal()}
              onClose={() => this.closeAlertModal()}
              text={"Maršruts veiksmīgi izveidots!"}
              />
            }
  
            { this.state.isModalOpen == true && 
              <MyTripsModal
              text={"Vai tiešām vēlaties izveidot šādu maršrutu?"}
              execute={() => this.handleSubmit()}
              onClose={() => this.closeModal()}
              show={this.state.isModalOpen}
            />
            }
  
            <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}>
              <h2>Maršruta izveidošana</h2>
            </Grid>
  
            <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}>
            <TextField 
                name="from"
                value={this.state.from} 
                fullWidth={true} 
                id="outlined-basic" 
                label="Sākumpunkts" 
                variant="outlined" 
                onChange={this.handleChange} 
                error = {this.state.fromError}
                helperText="Tekstam jāsatur vismaz 3 rakstzīmes"
            />
            </Grid>
            <Grid container wrap="nowrap" style={{ padding: "5px", margin: "10px" }}> 
            <TextField 
                name="to"
                value={this.state.Destination} 
                fullWidth={true} 
                id="outlined-basic" 
                label="Galamērķis" 
                variant="outlined" 
                onChange={this.handleChange} 
                error = {this.state.toError}
                helperText="Tekstam jāsatur vismaz 2 rakstzīmes"
            />
            </Grid>
            <Grid container justify="flex-end">
                <Button className={classes.button} type="submit">Saglabāt</Button>
            </Grid>
            </Paper>
          </form>
          )
        }
        </div>
      )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(withStyles(useStyles)(NewRoute));
