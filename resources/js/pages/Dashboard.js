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

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      routes: null,
      error: false,
      data: []
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

  // handleSubmit = e => {
  //   e.preventDefault();
  //   const { todo } = this.state;
  //   this.addTodo(todo);
  // };

  render() {
    const { data, error } = this.state;

    return (
      data.map(routes => (
          <Card className={this.props.classes}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {routes.from} - {routes.to}
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
