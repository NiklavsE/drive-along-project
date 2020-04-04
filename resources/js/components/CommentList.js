import React, { Component } from "react";
import MyTrips from "../pages/MyTrips";
import { connect } from "react-redux";

class CommentList extends Component {
  render() {
    return this.props.comments.length
    ? (
      this.props.comments.map(comment => (
        <div key={comment.id}>
          {comment.author} - {comment.text}
        </div>
      ))
    ) : null;
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(CommentList);