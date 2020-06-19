import React , { Component } from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {handleGetUsers} from '../actions/users';
import {handleLoginUser} from '../actions/auth';
import LoadingBar from "react-redux-loading-bar";



class Login extends Component{
    state = {
        userSelected: ''
    };

    componentDidMount() {
        this.props.dispatch(handleGetUsers());
    }

    handleChange = (e) => {
        const userSelected = e.target.value;

        this.setState(() => ({
            userSelected
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const {dispatch} = this.props;

        dispatch(handleLoginUser(this.state.userSelected));
    };
    render(){
            if (this.props.loading === true || !this.props.users) {
                return <div/>;
            }

            const {from} = this.props.location.state || {from: {pathname: '/'}};

            if (this.props.isAuthed) {
                return <Redirect to={from}/>;
            }
        
        return(
            <div className='container'>
                <LoadingBar />
                <div className='Login-main-cont row'>
                    <div className='login-sub-cont col-xs-8'>
                        <div className='Login-header'>
                            <h1>Welcome to the would you rather app</h1>
                            <div>Press sign in to continue</div>
                        </div>
                        <div>
                        <form id="Login" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                        <select className="form-control" id="userId"
                                                onChange={(e) => this.handleChange(e)}>
                                            <option></option>
                                            {
                                                Object.keys(this.props.users).map((user) => {
                                                    return <option key={this.props.users[user].id}
                                                                value={this.props.users[user].id}>{this.props.users[user].name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                <button className="btn btn-primary btn-block">Sign In</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps({users, login}) {
    return {
        loading: users === null,
        users,
        isAuthed: login.authenticated
    }
}

export default connect(mapStateToProps)(Login);