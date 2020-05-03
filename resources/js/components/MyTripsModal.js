import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';

const useStyles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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

class MyTripsModal extends Component {
  render() {
    const { classes } = this.props;

    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }
  
    return (
      <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={this.props.show}
        onClose={this.props.onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.show}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Paziņojums</h2>
            <p id="transition-modal-description">{ this.props.text }</p>
            <Button className={classes.button} onClick={this.props.execute}>Apstiprināt</Button>
          </div>
        </Fade>
      </Modal>
    </div>
    );
  }
}

MyTripsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default withStyles(useStyles)(MyTripsModal);