import React, { Component } from "react";
import { connect } from "react-redux";
import Http from "../Http";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Spinner from '../components/spinner/Spinner';
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";

const useStyles = theme => ({
  paper: {
    padding: "20px 20px", 
    margin: "20px 60px",
  },
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

  render() {
    const { data, error } = this.state;

    return (
      <div>
      {this.state.isLoadingRoutes ? 
        (<Spinner />) : (
      data.map(route => (
        <Link
        underline='none'
        to={{
          pathname: "/trips",
          state: { tripRoute: route.id }
        }}
        key = {route.id}
      >
        <Paper className={this.props.classes.paper}>
              <Typography align="center" gutterBottom variant="h5" component="h2">
                {route.from} - {route.to}
              </Typography>
        </Paper>
        </Link>
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
  