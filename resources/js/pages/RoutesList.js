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
import Spinner from '../components/spinner/Spinner';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
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
        <Card className={this.props.classes}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {route.from} - {route.to}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
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

export default connect(mapStateToProps)(Routeslist);