import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import LevelsPage from './pages/LevelsPage/LevelsPage';
import QuestionsAnsPage from './pages/QuestionsAnsPage/QuestionsAnsPage';
import ResultPage from './pages/ResultPage/ResultPage';
import CorrectAnswerInfo from './components/CorrectAnswerInfo';
import { Provider } from 'react-redux';
import ProfileInfo from './components/ProfileInfo';
import store from './store';
import ScenarioQuesAns from './pages/ScenarioBased/ScenarioQuesAns';

const Routes = () => (
	<Router>
		<div>
			<Route path="/" exact component={App} />
			<Route path="/module/:moduleId/level/:levelId/questions/" exact component={QuestionsAnsPage} />
			<Route path="/module/:moduleId/levels" exact component={LevelsPage} />
			<Route path="/module/scenario/:moduleId/level/:levelId/questions" exact component={ScenarioQuesAns} />
			<Route path="/results" exact component={ResultPage} />
			<Route path="/info" exact component={CorrectAnswerInfo} />
			<Route path="/profile" exact component={ProfileInfo} />
		</div>
	</Router>
);

ReactDOM.render(
	<Provider store={store}>
		<Routes />
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
