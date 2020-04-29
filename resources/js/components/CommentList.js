import React, { Component } from "react";
import MyTrips from "../pages/MyTrips";
import { connect } from "react-redux";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";

class CommentList extends Component {
  render() {
    return this.props.comments.length
    ? (
      this.props.comments.map(comment => (
        <Paper style={{ padding: "20px 10px", margin: "10px" }} key={comment.id}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid justifycontent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>{ comment.author }</h4>
            <p style={{ textAlign: "left" }}>
              { comment.text }
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              { comment.timestamp }
            </p>
          </Grid>
        </Grid>
        </Paper>
      ))
    ) : null;
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(CommentList);