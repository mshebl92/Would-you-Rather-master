import React, {Component} from 'react';
import {connect} from 'react-redux';
import {handleAddQuestionAnswer} from '../actions/shared';
import {Redirect} from "react-router-dom";
import PageNotFound from "./PageNotFound";

class QuestionPoll extends Component {


    state = {
        optionSelected: '',
        answerSubmitted: false
    };

    handleSubmit(e, questionId) {
        e.preventDefault();

        const {dispatch} = this.props;
        const {optionSelected} = this.state;

        dispatch(handleAddQuestionAnswer(questionId, optionSelected));

        this.setState(() => ({
            optionSelected: '',
            answerSubmitted: true
        }));
    }

    handleInputChange = (e) => {
        const text = e.target.value;

        this.setState(() => ({
            optionSelected: text
        }));
    };

    render() {
      const {question, author, pageNotFound,authedUser} = this.props;

      if (pageNotFound === true) {
          return <PageNotFound/>;
      }

      const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;

      const AnseredOption = question.optionOne.votes.includes(authedUser)?"OptionOne":null || question.optionTwo.votes.includes(authedUser)?"OptionTwo":null;
console.log(AnseredOption);
console.log(author.id);
console.log(authedUser)

      let optionOneWidth = Math.round((question.optionOne.votes.length / totalVotes) * 100);
      let optionTwoWidth = Math.round((question.optionTwo.votes.length / totalVotes) * 100);

        const {optionSelected, answerSubmitted} = this.state;
        const {id} = this.props;

        if (pageNotFound === true) {
            return <PageNotFound/>;
        }

        const redirectTo = `/question/${id}/results`;

        if (answerSubmitted === true) {
            return <Redirect to={redirectTo}/>;
        }

        return (
          !AnseredOption?(
            <div>
                <div className='projectContainer'>
                    <div className='container'>
                        <div className='row justify-content-center'>
                            <div className='col-sm-8'>
                                <div className='card'>
                                    <div className='card-header bold'>{author.name} asks would you rather...</div>
                                    <div className='card-body'>
                                        <div className='container'>
                                            <div className='row justify-content-center'>
                                                <div className='col-sm-4 border-right center'>
                                                    <img src={author.avatarURL}
                                                         alt={`Avatar of ${author.name}`}
                                                         className='avatar'/>
                                                </div>
                                                <div className='col-sm-8'>
                                                    <div className='question-info'>
                                                        <form onSubmit={(e) => this.handleSubmit(e, id)}>
                                                            <div className="form-check">
                                                                <input className="form-check-input"
                                                                       type="radio"
                                                                       name="questionPoll"
                                                                       id="optionOne"
                                                                       value="optionOne"
                                                                       onChange={this.handleInputChange}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="optionOne">
                                                                    {question.optionOne.text}
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input className="form-check-input"
                                                                       type="radio"
                                                                       name="questionPoll"
                                                                       id="optionTwo"
                                                                       value="optionTwo"
                                                                       onChange={this.handleInputChange}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="exampleRadios2">
                                                                    {question.optionTwo.text}
                                                                </label>
                                                            </div>
                                                            <button
                                                                className='btn btn-outline-primary m-15-top'
                                                                type='submit'
                                                                disabled={optionSelected === ''}
                                                            >
                                                                Submit
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          ):(
            <div>
                <div className='projectContainer'>
                    <div className='container'>
                        <div className='row justify-content-center'>
                            <div className='col-sm-8'>
                                <div className='card'>
                                    <div className='card-header bold'>Added by {author.name}</div>
                                    <div className='card-body'>
                                        <div className='container'>
                                            <div className='row justify-content-center'>
                                                <div className='col-sm-4 border-right vert-align'>
                                                    <img src={author.avatarURL}
                                                         alt={`Avatar of ${author.name}`}
                                                         className='avatar'/>
                                                </div>
                                                <div className='col-sm-8'>
                                                    <div className='question-info'>
                                                        <div className='col-sm-12 '>
                                                            <div className='results-header'>Results:</div>
                                                            <div>your chosen option is highlighted in green</div>
                                                            <div className={`card card-poll-results ${(optionSelected === 'optionOne') ? "chosen-answer" : ""}`}>Would you rather {question.optionOne.text}?

                                                                <div className="progress m-progress--sm">
                                                                    <div className="progress-bar m--bg-success"
                                                                         style={{ width: optionOneWidth + '%' }}
                                                                         ></div>
                                                                </div>
                                                                <div>
        <span>{question.optionOne.votes.length} out of {totalVotes} votes. ({optionOneWidth}%)</span>
                                                                </div>

                                                            </div>
                                                            <div className={`card card-poll-results ${(optionSelected === 'optionTwo') ? "chosen-answer" : ""}`}>Would you rather {question.optionTwo.text}?

                                                                <div className="progress m-progress--sm">
                                                                    <div className="progress-bar m--bg-success"
                                                                         style={{ width: optionTwoWidth + '%' }}
                                                                    ></div>
                                                                </div>
                                                                <div>
                                                                    <span>{question.optionTwo.votes.length} out of {totalVotes} votes. ({optionTwoWidth}%)</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )

        )
    }
}

function mapStateToProps({login, questions, users, match,authedUser}, props) {
    const {id} = props.match.params;

    let pageNotFound = true;
    let author = "";
    let specificQuestion = "";

    if (questions[id] !== undefined) {
        pageNotFound = false;
        specificQuestion = questions[id];
        author = users[specificQuestion['author']];
    }

    return {
        id,
        question: specificQuestion,
        author: author,
        authedUser: login.loggedInUser.id,
        pageNotFound: pageNotFound
    }
}

export default connect(mapStateToProps)(QuestionPoll);
