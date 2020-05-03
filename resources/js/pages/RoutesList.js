import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Spinner from '../components/spinner/Spinner';
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import AlertModal from '../components/AlertModal';
import ClipLoader from "react-spinners/ClipLoader";

const useStyles = theme => ({
  paper: {
    padding: "20px 20px", 
    margin: "20px 60px",
  },
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

class Routeslist extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      error: false,
      data: [],
      isLoadingRoutes: true,
    };

    // API endpoint.
    this.api = "/api/v1/routes";
  }

  componentDidMount() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.setState({
      isLoadingRoutes: true,
    });

    Http.get(`${this.api}`)
      .then(response => {
        const { data } = response.data;
        this.setState({
          data,
          error: false
        });
        this.setState({isLoadingRoutes: false})
      })
      .catch(() => {
        this.setState({
          error: "Unable to fetch data."
        });
      });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  OpenDeleteRouteModal(routeId) {
    this.setState({
      'deleteRouteId': routeId,
      'OpenDeleteRouteModal': true,
    });
  }

  closeAlertModal() {
    this.setState({
      OpenDeleteRouteModal: false,
      deleteRouteId: null,
    });
  }

  deleteRoute(id) {
    this.setState({
      OpenDeleteRouteModal: false,
      deleteRouteId: id,
    });

    const api = 'api/v1/route';
    Http.delete(`${api}/${id}`)
    .then(response => {
      if(response.data.errors == false) { 
        this.setState({
          deleteRouteId: null,
        });

        this.loadRoutes();
      }
    });
  }

  render() {
    const { data, error } = this.state;

    const { classes } = this.props;

    return (
      <div>
      {this.state.isLoadingRoutes ? 
        (<Spinner />) : (
      data.map(route => (
        <Paper className={this.props.classes.paper} key = {route.id}>
                      
        { this.state.deleteRouteId == route.id && 
          <AlertModal
          show={this.state.OpenDeleteRouteModal}
          execute={() => this.deleteRoute(this.state.deleteRouteId)}
          onClose={() => this.closeAlertModal()}
          text={"Vai tiešām vēlaties dzēst doto maršrutu?"}
          />
        }

        <Grid container wrap="nowrap">
          <Grid item xs={10}>
            <Typography align="center" gutterBottom variant="h5" component="h2">
              <Link
                underline='none'
                to={{
                  pathname: "/trips",
                  state: { tripRoute: route.id }
                }}
                color="inherit"
              >
                {route.from} - {route.to}
              </Link>
            </Typography>
          </Grid>
          <Grid itme xs={2}>
            { this.state.deleteRouteId == route.id && <ClipLoader
              size={30}
              color={"#0066ff"}
            /> }
            { (this.props.user.admin && this.state.deleteRouteId == null) ? (<Button className={classes.deleteButton} onClick={() => this.OpenDeleteRouteModal(route.id)}>X Dzēst</Button>) : null }
          </Grid>
        </Grid>
        </Paper>
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


export default connect(mapStateToProps)(withStyles(useStyles)(Routeslist));
  