import {combineReducers} from 'redux';
import users from './users';
import questions from './questions';
import login from './auth';
import { loadingBarReducer } from 'react-redux-loading-bar'

export default combineReducers({
    users,
    questions,
    login,
    loadingBar: loadingBarReducer,
});