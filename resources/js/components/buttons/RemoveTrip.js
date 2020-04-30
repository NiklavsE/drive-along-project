import React, { Component } from "react";
import { connect } from "react-redux";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Http from "../../Http";
import ClipLoader from "react-spinners/ClipLoader";
import AlertModal from '../AlertModal';

class RemoveTrip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleted: false,
            confirmDelete: false,
            loading: false,
        };

        this.api = '/api/v1/trips';
    }
    deleteTrip(trip) {
        this.setState({
            loading: true,
            confirmDelete: false, 
        });

        Http.delete(`${this.api}/${trip}`)
        .then(response => {
            if(response.data.errors == false) {
                this.setState({
                    deleted: true,
                    loading: false,
                });
            }
        })
    }

    closeAlertModal() {
        this.setState({
            confirmDelete: false,
            deleted: false,
        })
    }

    confirmDelete() {
        this.setState({
            confirmDelete: true,
        });
    }

    render() {
        return this.props.trip ? (
            <div>

            { this.state.confirmDelete && 
                <AlertModal
                show={this.state.confirmDelete}
                execute={() => this.deleteTrip(this.props.trip)}
                onClose={() => this.closeAlertModal()}
                text={"Vai tiešām vēlaties dzēst doto braucienu?"}
                />
            }

            { this.state.deleted &&
                <AlertModal
                    show={this.state.deleted}
                    execute={() => this.props.reloadData()}
                    onClose={() => this.props.reloadData()}
                    text={"Brauciens veiksmīgi dzēsts!"}
                />
            }
            
            { this.state.loading ? 
            (<ClipLoader
                size={50}
                color={"#0066ff"}
            />) : (
                <Button
                variant="contained" 
                color="secondary"
                onClick={() => this.confirmDelete(this.props.trip)}
            >
                Noņemt braucienu            
            </Button>
            )}
            
            </div>
        ) : null;
    }
}


export default RemoveTrip;






