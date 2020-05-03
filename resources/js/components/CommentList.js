import React, { Component } from "react";
import MyTrips from "../pages/MyTrips";
import { connect } from "react-redux";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import AlertModal from '../components/AlertModal';
import Http from "../Http";
import ClipLoader from "react-spinners/ClipLoader";
import { withStyles } from "@material-ui/core/styles";

const useStyles = theme => ({
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

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      OpenDeleteCommentModal: false,
      deleteCommentId: null,
      isDeletingCommentId: null,
    }
  }

  deleteComment(id) {
    this.setState({
      OpenDeleteCommentModal: false,
      isDeletingCommentId: id,
    });

    const api = 'api/v1/comment';
    Http.delete(`${api}/${id}`)
    .then(response => {
      if(response.data.errors == false) { 
        this.setState({
          isDeletingCommentId: null,
        });

        this.props.reloadComments();
      }
    });
  }

  OpenDeleteCommentModal(commentId) {
    this.setState({
      OpenDeleteCommentModal: true,
      deleteCommentId: commentId,
    });
  }

  closeAlertModal() {
    this.setState({
      OpenDeleteCommentModal: false,
      deleteCommentId: null,
    });
  }

  render() {
    const { classes } = this.props;

    return this.props.comments.length
    ? (
      this.props.comments.map(comment => (
        <Paper style={{ padding: "20px 10px", margin: "10px" }} key={comment.id}>
        
        { this.state.deleteCommentId == comment.id && 
          <AlertModal
          show={this.state.OpenDeleteCommentModal}
          execute={() => this.deleteComment(this.state.deleteCommentId)}
          onClose={() => this.closeAlertModal()}
          text={"Vai tiešām vēlaties dzēst doto komentāru?"}
          />
        }
        
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid justifycontent="left" item xs zeroMinWidth xs={10}>
            <h4 style={{ margin: 0, textAlign: "left" }}>{ comment.author }</h4>
            <p style={{ textAlign: "left" }}>
              { comment.text }
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              { comment.timestamp }
            </p>
          </Grid>
          <Grid item xs={2}>
            { this.state.isDeletingCommentId == comment.id && <ClipLoader
              size={30}
              color={"#0066ff"}
            /> }
            { (this.props.user.admin && this.state.isDeletingCommentId == null) ? (<Button className={classes.deleteButton} onClick={() => this.OpenDeleteCommentModal(comment.id)}>X Dzēst</Button>) : null }
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

export default connect(mapStateToProps)(withStyles(useStyles)(CommentList));