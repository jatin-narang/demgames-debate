import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Card from '../../components/Card';
import arrowBackUrl from '../../images/back.png';
import infoUrl from '../../images/info.png';
import correctAnsUrl from '../../images/correct.png';
import wrongAnsUrl from '../../images/wrong.png';
import oopsUrl from '../../images/oops.png';
import hurreyUrl from '../../images/hurrey.png';
import AnswerInfoPopup from '../../components/AnswerInfoPopup';
import CorrectAnswerInfo from '../../components/CorrectAnswerInfo';
import ProgressBar from '../../components/ProgressBar';
import { connect } from 'react-redux';
import './styles.scss';
import GameInfo from '../../components/GameInfo';
import PropTypes from 'prop-types';

class QuestionsAnsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			answerClick: false,
			questionId: 1,
			showAnswer: false,
			selectedAnswer: [],
			answerCorrect: true,
			parScoreStatus: true,
			showCorrectAns: false,
			currentScore: 0,
			click: false,
			selectedCard: null,
			answerClicked: 0,
			clickedOptions: [],
			selectedOption: 0
		};
	}

	//Put api call to update scores at backend.
	// handleUpdateScore = (newScore) => {
	// 	let data = { score: newScore };
	// 	return fetch(
	// 		config.baseUrl +
	// 			`/api/module/${this.props.match.params.moduleId}/level/${this.props.match.params.levelId}/update-score`,
	// 		{
	// 			method: 'PUT',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify(data)
	// 		}
	// 	)
	// 		.then((response) => {
	// 			if (response.status >= 200 && response.status < 300) {
	// 				console.log('Update score success');
	// 				console.log(response.json());
	// 			} else {
	// 				console.log('Update score fail');
	// 			}
	// 		})
	// 		.catch((status, err) => {
	// 			console.log(err);
	// 		});
	// };

	//To hide question answer and render selected option abd right option.
	showRightAnswer = () => {
		this.setState({ showCorrectAns: true });
	};

	//To show question answer and hide selected option abd right option.
	hideRightAnswer = () => {
		this.setState({ showCorrectAns: false });
		this.nextQuestion();
	};

	//Checks for correct answer and add or reduces scores.
	checkCorrectAnswer = () => {
		const correctAns = this.getCorrectAnswer();
		const selectedValue = this.state.selectedAnswer;
		selectedValue.sort();
		correctAns.sort();
		if (JSON.stringify(selectedValue) === JSON.stringify(correctAns)) {
			this.setState((prevState) => ({
				answerCorrect: true,
				currentScore: prevState.currentScore + 10
			}));
		} else {
			this.setState((prevState) => ({
				answerCorrect: false,
				currentScore: prevState.currentScore - 10
			}));
		}
	};

	// Increments the question Id by 1 for non-scenario modules and for scenario type it takes it to the linked question.
	nextQuestion = () => {
		this.setState((prevState) => ({
			questionId: prevState.questionId + 1,
			selectedAnswer: []
		}));
	};

	//Handles option click and changes the answerClick state and hides the proceed next button.
	handleNextClick = () => {
		this.setState({ answerClick: false });
	};

	//Handle proceed button click, answer-info dialog box rendering, option click and check for correctAns
	handleProceedNext = () => {
		this.setState((prevState) => ({
			showAnswer: !prevState.showAnswer,
			selectedCard: null,
			answerClicked: 0,
			clickedOptions: []
		}));
		this.handleNextClick();
		this.handleClickOpen();
		this.checkCorrectAnswer();
	};

	handleClick = () => {
		this.setState((prevState) => ({ showAnswer: !prevState.showAnswer }));
		this.handleNextClick();
	};

	//Return Correct answer for current question.
	getCorrectAnswer = () => {
		const { questionId } = this.state;
		let moduleId = this.props.match.params.moduleId;
		let level = parseInt(this.props.match.params.levelId);
		let questions = this.props.gameData.gameData[moduleId - 1].levels[level - 1].questions;
		var totalQuestion = 0;
		if (questions && questions.length > 0) {
			totalQuestion = questions.length;
			var correctAns = questionId <= totalQuestion ? questions[questionId - 1].correct_answer : null;
			return correctAns;
		}
	};

	//Return progress for current level.
	getProgress = () => {
		const { questionId } = this.state;
		let moduleId = this.props.match.params.moduleId;
		let level = parseInt(this.props.match.params.levelId);

		let questions = this.props.gameData.gameData[moduleId - 1].levels[level - 1].questions;
		var totalQuestion = 0;
		if (questions && questions.length > 0) {
			totalQuestion = questions.length;
			var progress = (questionId - 1) / totalQuestion * 100;
			return progress;
		}
	};

	//Renders game info dialog box.
	handleInfoOpen = () => {
		this.setState({ infoOpen: true });
	};

	//Hide game info dialog box.
	handleInfoClose = () => {
		this.setState({ infoOpen: false });
	};

	//Renders AnswerInfo popup and show the points scored.
	handleClickOpen = () => {
		this.setState({ open: true });
	};
	//Hide AnswerInfo popup and show the points scored and also checks for parScoreStatus.
	handleClose = () => {
		this.setState((prevState) => ({
			open: false,
			showAnswer: !prevState.showAnswer
		}));

		this.checkParScoreStatus();
	};

	// Listens to no of answers clicked and compare it with actual number of answers for a
	// particular question and if it gets equal it locks the options cards.
	checkAnsClicked = (answerClicked) => {
		let moduleId = this.props.match.params.moduleId;
		let level = parseInt(this.props.match.params.levelId);
		let questions = this.props.gameData.gameData[moduleId - 1].levels[level - 1].questions;
		const { questionId } = this.state;
		let correctAnsLength = questions[questionId - 1].correct_answer.length;
		if (answerClicked === correctAnsLength) {
			this.setState({ answerClick: true });
		}
	};

	handleAnswerClick = (correctAns, key) => (e) => {
		const { clickedOptions } = this.state;
		clickedOptions.push(key);
		const selectedValue = key;
		const { selectedAnswer } = this.state;
		selectedAnswer.push(selectedValue);
		this.setState(
			(prevState) => ({
				answerClicked: prevState.answerClicked + 1,
				selectedAnswer: selectedAnswer,
				selectedCard: key,
				selectedOption: key
			}),
			() => {
				const { answerClicked } = this.state;
				this.checkAnsClicked(answerClicked);
			}
		);
	};

	//Checks if current score + previous score is less than parScore and return parScoreStatus.
	checkParScoreStatus = () => {
		let moduleId = this.props.match.params.moduleId;
		let level = parseInt(this.props.match.params.levelId);

		const { currentScore } = this.state;
		const parScores = this.getParScores();
		let currentLevelNewScores = this.props.gameData.scores[moduleId - 1];
		let prevScore = currentLevelNewScores[level - 1];
		if (prevScore + currentScore < parScores[level]) {
			this.setState({ parScoreStatus: false });
		} else {
			this.setState({ parScoreStatus: true });
		}
	};

	//Get list of module names.
	getModuleNames = () => {
		const gameData = this.props.gameData.gameData;
		const moduleNames = [];
		gameData.map((modules) => {
			return moduleNames.push(modules.name);
		});
		return moduleNames;
	};

	//Returns number of questions for current level.
	getTotalQuestions = () => {
		let moduleId = this.props.match.params.moduleId;
		let level = parseInt(this.props.match.params.levelId);

		let questions = this.props.gameData.gameData[moduleId - 1].levels[level - 1].questions;
		var totalQuestion = 0;
		if (questions && questions.length > 0) {
			totalQuestion = questions.length;
		}
		return totalQuestion;
	};

	//Get list of parScores for a module.
	getParScores = () => {
		let moduleId = this.props.match.params.moduleId;
		const parScores = this.props.gameData.gameData[moduleId - 1].levels.map((level) => level.par_score);
		return parScores;
	};

	//Handle proceed button for scenario type.
	handleScenarioProceed = () => {
		this.setState((prevState) => ({
			selectedCard: null,
			answerClicked: 0,
			clickedOptions: []
		}));

		this.handleNextClick();
		this.nextQuestion();
	};

	render() {
		const {
			answerClick,
			questionId,
			showAnswer,
			answerCorrect,
			open,
			parScoreStatus,
			showCorrectAns,
			currentScore,
			selectedAnswer,
			infoOpen,
			clickedOptions,
			moduleScenario,
			selectedOption
		} = this.state;

		let moduleId = parseInt(this.props.match.params.moduleId);
		let level = parseInt(this.props.match.params.levelId);
		const totalQuestion = this.getTotalQuestions();
		const correctAns = this.getCorrectAnswer();
		const ansLength = correctAns !== null && parseInt(correctAns.length);
		const progress = this.getProgress();
		const parScores = this.getParScores();
		const moduleNames = this.getModuleNames();
		const backUrl = `/module/${moduleId}/levels`;
		const questions = this.props.gameData.gameData[moduleId - 1].levels[level - 1].questions;
		const nextQuestionId =
			questionId <= totalQuestion && questions[questionId - 1].options[selectedOption].linked_question;

		return (
			<Fragment>
				<div className="question-main-container">
					<div className="game-type-help">
						<div className="back-module-container">
							<button className="back-button">
								<a href={backUrl}>
									<img className="back-icon" src={arrowBackUrl} alt="back-arrow" />
								</a>
							</button>

							<p className="questions-page-module-name">
								{moduleNames[this.props.match.params.moduleId - 1]}
							</p>
						</div>
						<img className="info-icon" src={infoUrl} alt="info-icon" onClick={this.handleInfoOpen} />
					</div>
					<Fragment>
						{// nextQuestionId === null &&
						totalQuestion > 0 &&
						questionId > totalQuestion && (
							<Redirect
								to={{
									pathname: '/results',
									state: {
										moduleId: moduleId,
										parScoreStatus: parScoreStatus,
										currentScore: currentScore,
										moduleName: moduleNames[moduleId - 1],
										level: level,
										image: parScoreStatus ? hurreyUrl : oopsUrl,
										messageOne: parScoreStatus
											? `Hurray! You have scored  ${currentScore > 0 ? currentScore : 0}/100.`
											: `Oh! You have scored only  ${currentScore > 0 ? currentScore : 0}/100.`,
										messageTwo: parScoreStatus
											? `You are in top 100 in the rank.`
											: `You need to earn ${parScores[level]}/100 for Level ${level}.`,
										buttonMessage: !parScoreStatus
											? `Retry Level ${level}`
											: `Continue Level ${level + 1}`
									}
								}}
							/>
						)}

						{!showCorrectAns ? (
							totalQuestion > 0 &&
							questionId <= totalQuestion && (
								<div>
									<div className="level-question-detail">
										<span>Level {level} :</span>
										<span className="question-number-status">
											Question {questionId} out of {totalQuestion}
										</span>
									</div>
									<div className="progress-bar-container">
										<ProgressBar progress={progress} />
									</div>
									<div className="questions-container">
										<p className="question-label">
											{questions && questions.length > 0 && questions[questionId - 1].question}
										</p>
									</div>
									<div className="answer-container">
										{!showAnswer ? (
											<p className="select-label">
												Select {ansLength > 1 ? ansLength + ' answers.' : ' the right answer.'}
											</p>
										) : null}
										<div className="options-card-container">
											{questions &&
												questions.length > 0 &&
												questions[questionId - 1].options.map((option, key) => (
													<Card
														key={key}
														option={option}
														correct_answer={questions[questionId - 1].correctAns}
														answerClick={answerClick}
														selectedCard={clickedOptions.includes(key)}
														handleClick={this.handleAnswerClick(correctAns, key)}
													/>
												))}
										</div>
									</div>

									{answerClick && (
										<button
											className={`next-page-button next-page-button-${answerClick}`}
											onClick={this.handleProceedNext}
										>
											Proceed
										</button>
									)}
								</div>
							)
						) : (
							<CorrectAnswerInfo
								correctAns={correctAns}
								selectedAnswer={selectedAnswer}
								hideRightAnswer={this.hideRightAnswer}
								moduleId={moduleId}
								level={level}
								questionId={questionId}
								totalQuestion={totalQuestion}
							/>
						)}
					</Fragment>
					{answerCorrect ? (
						<AnswerInfoPopup
							open={open}
							message={'Your answer is correct'}
							answerStatus={true}
							handleClose={this.handleClose}
							imageUrl={correctAnsUrl}
							nextQuestion={this.nextQuestion}
						/>
					) : (
						<AnswerInfoPopup
							open={open}
							message={'Oh! Seems like you selected the wrong answer.'}
							answerStatus={false}
							handleClose={this.handleClose}
							imageUrl={wrongAnsUrl}
							showRightAnswer={this.showRightAnswer}
							nextQuestion={this.nextQuestion}
						/>
					)}
				</div>
				{infoOpen && <GameInfo open={infoOpen} handleClose={this.handleInfoClose} />}
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return { gameData: state.gameData };
};

QuestionsAnsPage.propTypes = {
	gameData: PropTypes.object,
	match: PropTypes.object
};

export default connect(mapStateToProps, null)(QuestionsAnsPage);

// export default QuestionsAnsPage;
