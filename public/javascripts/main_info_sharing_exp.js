/*

A cooperative multi-player 2-armed bandit with information sharing 
Author: Wataru Toyokawa (wataru.toyokawa@uni-konstanz.de)
Collaborating with Helge and Miriam 
12 November 2021

1. The task is basically the same as in the pilot test 
	(see: https://github.com/WataruToyokawa/SelectiveInfoShare_pilotExp)
2. However, the information sharing cost is constant here 
3. An environmental change is introduced
4. Please see the preregistration for more details: url

*/

'use strict';

// ==== Import Scenes ===========================================
import SceneWaitingRoom0 from './scenes/SceneWaitingRoom0.js';
import SceneWaitingRoom from './scenes/SceneWaitingRoom.js';
import SceneWaitingRoom2 from './scenes/SceneWaitingRoom2.js';
import SceneInstruction from './scenes/SceneInstruction.js';
import SceneTutorial from './scenes/SceneTutorial.js';
import SceneTutorialFeedback from './scenes/SceneTutorialFeedback.js';
import SceneTutorialSharingCostExplained from './scenes/SceneTutorialSharingCostExplained.js';
import SceneBeforeUnderstandingTest from './scenes/SceneBeforeUnderstandingTest.js';
import SceneUnderstandingTest from './scenes/SceneUnderstandingTest.js';
import ScenePerfect from './scenes/ScenePerfect.js';
import SceneStartCountdown from './scenes/SceneStartCountdown.js';
import ScenePayoffFeedback from './scenes/ScenePayoffFeedback.js';
import SceneMain from './scenes/SceneMain.js';
import SceneGoToNewGameRound from './scenes/SceneGoToNewGameRound.js';
import SceneGoToQuestionnaire from './scenes/SceneGoToQuestionnaire.js';
import SceneMessagePopUp from './scenes/SceneMessagePopUp.js';

// ===== Import Functions =============================
import {rand
	, isNotNegative
	, BoxMuller
	, BoxMuller_positive
	, sum
	, waitingBarCompleted
	, debug_pointerdown
	, sending_core_is_ready
	, goToQuestionnaire
	, settingConfirmationID
	, testFunction
    , settingRiskDistribution
    , settingRiskDistribution_4ab
} from './functions.js';

/**===============================================
	Phaser Game Script
==================================================*/

window.onload = function() {
	// basic experimental values goes to POST values (in game.ejs)
	$("#amazonID").val(amazonID);
    $("#completed").val(completed);
    $("#currentTrial").val(currentTrial);
    $("#gameRound").val(gameRound);

    //======== monitoring reload activity ==========
    if (window.performance & amazonID != 'INHOUSETEST') {
        if (performance.navigation.type === 1) {
            // Redirecting to the questionnaire
            socket.io.opts.query = 'sessionName=already_finished';
            socket.disconnect();
            window.location.href = htmlServer + portnumQuestionnaire +'/questionnaireForDisconnectedSubjects?amazonID='+amazonID+'&info_share_cost='+info_share_cost+'&bonus_for_waiting='+waitingBonus+'&totalEarningInCent='+Math.round((totalPayoff_perIndiv*cent_per_point))+'&confirmationID='+confirmationID+'&exp_condition='+exp_condition+'&indivOrGroup='+indivOrGroup+'&completed='+0+'&latency='+submittedLatency;
        }
    }
    //======== end: monitoring reload activity =====

    //======== monitoring Tab activity ==========
    let hiddenTimer
    ,   hidden_elapsedTime = 0
    ;
        // Judging the window state at the moment of this window read
    if(window.document.visibilityState == 'hidden'){
        hiddenTimer = setInterval(function(){
            hidden_elapsedTime += 500;
            if (hidden_elapsedTime > browserHiddenPermittedTime) {
                socket.io.opts.query = 'sessionName=already_finished';
                socket.disconnect();
            }
        }, 500);
    }
        // When visibility status is changed, judge the status again
    window.document.addEventListener("visibilitychange", function(e){
        ////console.log('this window got invisible.');
        if (window.document.visibilityState == 'hidden') {
            hidden_elapsedTime += 1;
            hiddenTimer = setInterval(function(){
                hidden_elapsedTime += 500;
                if (hidden_elapsedTime > browserHiddenPermittedTime & amazonID != 'INHOUSETEST') {
                    socket.io.opts.query = 'sessionName=already_finished';
                    socket.disconnect();
                }
            }, 500);
        } else {
            clearTimeout(hiddenTimer);
            if (hidden_elapsedTime > browserHiddenPermittedTime & amazonID != 'INHOUSETEST') {
                setTimeout(function(){
                    // Force client to move to the questionnaire
                    socket.io.opts.query = 'sessionName=already_finished';
                    socket.disconnect();
                    completed = 'browserHidden';
                    window.location.href = htmlServer + portnumQuestionnaire +'/questionnaireForDisconnectedSubjects?amazonID='+amazonID+'&info_share_cost='+info_share_cost+'&bonus_for_waiting='+waitingBonus+'&totalEarningInCent='+Math.round((totalPayoff_perIndiv*cent_per_point))+'&confirmationID='+confirmationID+'&exp_condition='+exp_condition+'&indivOrGroup='+indivOrGroup+'&completed='+completed+'&latency='+submittedLatency;
                }, 200); // wait until waitingBonus is fully calculated
            }
            hidden_elapsedTime = 0;
        }
    });
    //======== end: monitoring tab activity =====

	let config = {
	    type: Phaser.AUTO, // Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO
	    width: configWidth,
	    height: configHeight,
	    physics: {
	        default: 'arcade',
	        arcade: {
	            gravity: { y: 300 },
	            debug: false
	        }
	    },
	    parent: 'phaser-game-main',
	    scale: {
	        _mode: Phaser.Scale.FIT,
	        // mode: Phaser.Scale.ScaleModes.FIT,
	        parent: 'phaser-game-main',
	        autoCenter: Phaser.Scale.CENTER_BOTH,
	        width: configWidth,
	        height: configHeight
	    },
	    dom: {
        	createContainer: true
    	},
	    scene:
	    [ SceneWaitingRoom0
	    , SceneWaitingRoom
	    , SceneWaitingRoom2
	    , SceneInstruction
    	, SceneTutorial
    	, SceneTutorialFeedback
    	, SceneTutorialSharingCostExplained
    	, SceneBeforeUnderstandingTest
    	, SceneUnderstandingTest
    	, ScenePerfect
    	, SceneStartCountdown
    	, SceneMain
    	, ScenePayoffFeedback
    	, SceneGoToNewGameRound
    	, SceneGoToQuestionnaire
    	, SceneMessagePopUp
    	]
	};

	let game = new Phaser.Game(config);
	game.scene.add('SceneWaitingRoom0');
	game.scene.add('SceneWaitingRoom');
	game.scene.add('SceneWaitingRoom2');
	game.scene.add('SceneInstruction');
	game.scene.add('SceneTutorial');
	game.scene.add('SceneTutorialFeedback');
	game.scene.add('SceneTutorialSharingCostExplained');
	game.scene.add('SceneBeforeUnderstandingTest');
	game.scene.add('SceneUnderstandingTest');
	game.scene.add('ScenePerfect');
	game.scene.add('SceneStartCountdown');
	game.scene.add('SceneMain');
	game.scene.add('ScenePayoffFeedback');
	game.scene.add('SceneGoToQuestionnaire');
	game.scene.add('SceneGoToNewGameRound');
	game.scene.add('SceneMessagePopUp');


	// I think this ping-pong monitoring is out-of-date; review needed. Discarded in the future
	socket.on('pong', function (ms) {
        ////console.log(`socket :: averageLatency :: ${averageLatency} ms`);
        averageLatency.push(ms);
        averageLatency.splice(0,1);
    });

    socket.on('this_is_your_parameters', function (data) {
    	//console.log('received "this_is_your_parameters" from the server');
        confirmationID = data.id;
        myRoom = data.room;
        maxChoiceStageTime = data.maxChoiceStageTime;
        indivOrGroup = data.indivOrGroup;
        exp_condition = data.exp_condition; //binary_4ab
        environment_change = data.environment_change;
        subjectNumber = data.subjectNumber;
        isLeftRisky = data.isLeftRisky;
        numOptions = data.numOptions;
        info_share_cost = data.info_share_cost;
        optionOrder = data.optionOrder;
        taskOrder = data.taskOrder;
        instructionText_indiv[1] = instructionText_indiv[1] + numOptions + ' slot machines.';
        instructionText_group[1] = instructionText_group[1] + numOptions + ' slot machines.';
        // console.log('this is your optionOrder: ' + optionOrder);
        //setSlotPosition(data.isLeftRisky);
        if (data.numOptions == 2) {
        	// settingRiskDistribution(data.riskDistributionId);
        	settingRiskDistribution(taskOrder[data.gameRound]); // data.taskOrder might be better?
            // console.log('task id is ' + taskOrder[data.gameRound]);
        } else {
        	settingRiskDistribution_4ab(data.riskDistributionId);
        }

        // avoiding safari's reload function
        if(!window.sessionStorage.getItem('uniqueConfirmationID')) {
            window.sessionStorage.setItem('uniqueConfirmationID', confirmationID);
        } else if (exceptions.indexOf(amazonID) == -1) {
            // there is already an unique confirmation id existing in the local storage
            socket.io.opts.query = 'sessionName=already_finished';
            socket.disconnect();
            window.location.href = htmlServer + portnumQuestionnaire + '/multipleAccess';
        }
        socket.io.opts.query = 'sessionName='+data.id+'&roomName='+data.room+'&amazonID='+amazonID+'&bonus_for_waiting='+waitingBonus+'&totalEarning='+totalEarning+'&confirmationID='+confirmationID+'&exp_condition='+exp_condition+'&indivOrGroup='+indivOrGroup+'&completed='+completed+'&latency='+submittedLatency;
        //console.log('client session name is ' + socket.io.opts.query);
        //console.log('and client subjectNumber is ' + subjectNumber);
        //console.log('and maxChoiceStageTime = ' + maxChoiceStageTime);
        //console.log('and confirmationID is = ' + confirmationID);
        $("#exp_condition").val(taskOrder[data.gameRound]);
        $("#info_share_cost").val(data.info_share_cost);
        settingConfirmationID(confirmationID);
    });

    socket.on('this is the remaining waiting time', function(data){
        isEnvironmentReady = true;
        maxWaitingTime = data.max;
        maxGroupSize = data.maxGroupSize;
        horizon = data.horizon;
        restTime = data.restTime;
        currentGroupSize = data.n;
        // console.log('socket.on: "this is the remaining waiting time" : '+restTime+' msec.');
        if (isPreloadDone & !isWaitingRoomStarted) {
        	// game.scene.start('ScenePerfect'); // debug

        	game.scene.start('SceneWaitingRoom'); // main

        } else {
        	//socket.emit('not ready yet');
        }
        //SceneWaitingRoom
        //core.replaceScene(core.waitingRoomScene(data.restTime));
    });

    socket.on('wait for others finishing test', function (data) {
    	game.scene.stop('SceneWaitingRoom0');
    	game.scene.stop('SceneWaitingRoom');
    	game.scene.stop('SceneInstruction');
    	game.scene.stop('SceneTutorial');
    	game.scene.stop('SceneTutorialFeedback');
    	game.scene.stop('SceneUnderstandingTest');
    	game.scene.stop('ScenePerfect');
    	game.scene.stop('SceneGoToNewGameRound');
        game.scene.start('SceneWaitingRoom2', data);
    });

    socket.on('n_test_passed updated', function (data) {
    	n_in_waitingRoom2 = data.n_test_passed;
        currentGroupSize = data.n;
    });

    socket.on('wait for others get ready to move on', function () {
    	game.scene.stop('SceneWaitingRoom0');
    	game.scene.stop('SceneWaitingRoom');
    	game.scene.stop('SceneInstruction');
    	game.scene.stop('SceneTutorial');
    	game.scene.stop('SceneTutorialFeedback');
    	game.scene.stop('SceneUnderstandingTest');
    	game.scene.stop('ScenePerfect');
    	game.scene.stop('SceneGoToNewGameRound');
        game.scene.start('SceneWaitingRoom2');
    });

    // The task starts
    socket.on('this room gets started', function(data) {
        //console.log('Group size reached ' + data.n + ' conditoin: ' + data.exp_condition + ' and indivOrGroup is ' + data.indivOrGroup);
        exp_condition = data.exp_condition;
        isLeftRisky = data.isLeftRisky;
        indivOrGroup = data.indivOrGroup;
        maxChoiceStageTime = data.maxChoiceStageTime;
        $("#indivOrGroup").val(indivOrGroup);
        $("#bonus_for_waiting").val(Math.round(waitingBonus));
        ////console.log('your indivOrGroup is ' + $("#indivOrGroup").val());
        /*if(indivOrGroup == 0) {
            choiceOpportunities = 3; //3
        } else {
            choiceOpportunities = 1;
        }*/
        waitingRoomFinishedFlag = 1;
        game.scene.stop('SceneWaitingRoom0');
        game.scene.stop('SceneWaitingRoom');

        // game.scene.start('ScenePerfect', data); // debug

       	game.scene.start('SceneInstruction', data);

    });

    socket.on('you guys are individual condition', function () {
    	//console.log('receive: "you guys are individual condition"');
        socket.emit('ok individual condition sounds good');
    });

    socket.on('all passed the test', function(data) {
    	currentGroupSize = data.n;
        //console.log('testPassed reached ' + data.testPassed + ' conditoin: ' + data.exp_condition);
        game.scene.stop('SceneWaitingRoom0');
        game.scene.stop('SceneWaitingRoom');
    	game.scene.stop('SceneInstruction');
    	game.scene.stop('SceneTutorial');
    	game.scene.stop('SceneTutorialFeedback');
    	game.scene.stop('SceneUnderstandingTest');
    	game.scene.stop('ScenePerfect');
    	game.scene.stop('SceneGoToNewGameRound');
        game.scene.stop('SceneWaitingRoom2');
        game.scene.start('SceneStartCountdown');
    });

    socket.on('all are ready to move on', function(data) {
        currentTrial = 1; // resetting the trial number
        gameRound = data.gameRound; // updating the game round
        // console.log('All are ready to move on to gameRound '+(gameRound+1))
        game.scene.stop('SceneWaitingRoom0');
        game.scene.stop('SceneWaitingRoom');
    	game.scene.stop('SceneInstruction');
    	game.scene.stop('SceneTutorial');
    	game.scene.stop('SceneTutorialFeedback');
    	game.scene.stop('SceneUnderstandingTest');
    	game.scene.stop('ScenePerfect');
    	game.scene.stop('SceneGoToNewGameRound');
        game.scene.stop('SceneWaitingRoom2');
        game.scene.start('SceneStartCountdown');
    });

    socket.on('client disconnected', function(data) {
        // console.log('client disconnected ' + data.disconnectedClient + ' left the room');
        currentGroupSize = data.n;
        if ( !isThisGameCompleted ) {
        	createWindow('SceneMessagePopUp', {msg: 'Notification: One member has been disconnected'});
        }
        if (isWaiting) {
        	socket.emit('can I proceed');
        	// console.log('"can I proceed" sent');
        }
    });

    socket.on('these are done subjects', function(data) {
        doneSubject = data.doneSubject;
        //console.log('doneSubject is ' + doneSubject);
    });

    socket.on('Proceed to next round', function(data) {
        mySocialInfo = data.socialInfo[data.pointer-2]; //[data.round-2];
        myPublicInfo = data.publicInfo[data.pointer-2];
        choiceOrder = data.choiceOrder[data.pointer-2];
        share_or_not = data.share_or_not[data.pointer-2];
        groupTotalScore = sum( data.groupTotalPayoff );
        totalPayoff_perIndiv = sum( data.totalPayoff_perIndiv );
        totalPayoff_perIndiv_perGame[gameRound] = data.totalPayoff_perIndiv_perGame[gameRound];
        // payoff_info = data.share_or_not[data.round-2]['payoff'];
        // shared_position = data.share_or_not[data.round-2]['position'];
        // console.log('mySocialInfo: ' + mySocialInfo);
        // console.log('myPublicInfo: ' + myPublicInfo);
        // console.log('choiceOrder: ' + choiceOrder);
        // console.log('totalPayoff_perIndiv_perGame: ' + totalPayoff_perIndiv_perGame[gameRound] + ' with group total = ' + groupTotalScore);
        for (let i = 0; i < maxGroupSize; i++) {
        	if(share_or_not[i] != null) {
        		// console.log('subjectNumber' + i + ': share:' + share_or_not[i].share + ', payoff:' +share_or_not[i].payoff+', position:'+share_or_not[i].position);
        	}
        }
        // console.log('share_or_not: ' + share_or_not);
        if (indivOrGroup == 1) {
        	for (let i = 1; i < numOptions+1; i++) {
        		mySocialInfoList['option'+i] = data.socialFreq[data.round-1][optionOrder[i-1] - 1];
        	}
        	// console.log('data.socialFreq[data.round-1] = ' + data.socialFreq[data.round-1]);
        } else {
        	for (let i = 1; i < numOptions+1; i++) {
        		if (myLastChoiceFlag == i) { // myLastChoice
        			mySocialInfoList['option'+i] = 1;
        		} else {
        			mySocialInfoList['option'+i] = 0;
        		}
        	}
        }

        currentTrial++;
        totalEarning += payoff - (info_share_cost * didShare);

        if (currentTrial == environment_change) {
            switch (taskOrder[data.gameRound]) {
                case 1:
                    settingRiskDistribution(2);
                    break;
                case 2:
                    settingRiskDistribution(1);
                    break;
                case 3:
                    settingRiskDistribution(4);
                    break;
                case 4:
                    settingRiskDistribution(3);
                    break;
                default:
                    settingRiskDistribution(2);
                    break;
            }
        }

        //$("#totalEarningInCent").val(Math.round((totalPayoff_perIndiv*cent_per_point)));
        //$("#totalEarningInUSD").val(Math.round((totalPayoff_perIndiv*cent_per_point))/100);
        $("#totalEarningInCent").val(Math.round((totalPayoff_perIndiv*cent_per_point)));
        $("#totalEarningInUSD").val(Math.round((totalPayoff_perIndiv*cent_per_point))/100);
        $("#currentTrial").val(currentTrial);
        $("#gameRound").val(gameRound);
        // $("#exp_condition").val(exp_condition);
        //$("#confirmationID").val(confirmationID);
        $("#bonus_for_waiting").val(Math.round(waitingBonus));
        // payoffText.destroy();
        // waitOthersText.destroy();
        for (let i =1; i<numOptions+1; i++) {
        	objects_feedbackStage['box'+i].destroy();
        }
    	game.scene.stop('ScenePayoffFeedback');
    	isWaiting = false
    	game.scene.start('SceneMain', {gameRound:gameRound, round:currentTrial});
    	//console.log('restarting the main scene!: mySocialInfo = '+data.socialFreq[data.round-1]);
    });

    socket.on('End this session', function(data) {
        //mySocialInfo = data.socialInfo[data.round-2];
        //myPublicInfo = data.publicInfo[data.round-2];
        //choiceOrder = data.choiceOrder[data.round-2];
        //mySocialInfoList['sure'] = data.socialFreq[data.round-1][surePosition];
        //mySocialInfoList['risky'] = data.socialFreq[data.round-1][riskyPosition];
        currentTrial++;
        totalEarning += payoff;
        // $("#totalEarningInCent").val(Math.round((totalPayoff_perIndiv*cent_per_point)));
        // $("#totalEarningInUSD").val(Math.round((totalPayoff_perIndiv*cent_per_point))/100);
        $("#totalEarningInCent").val(Math.round((totalPayoff_perIndiv*cent_per_point)));
        $("#totalEarningInUSD").val(Math.round((totalPayoff_perIndiv*cent_per_point))/100);
        $("#currentTrial").val(currentTrial);
        $("#gameRound").val(gameRound);
        $("#completed").val(1);
        // $("#exp_condition").val(exp_condition);
        //$("#confirmationID").val(confirmationID);
        // payoffText.destroy();
        // waitOthersText.destroy();
        for (let i =1; i<numOptions+1; i++) {
        	objects_feedbackStage['box'+i].destroy();
        }
    	game.scene.stop('ScenePayoffFeedback');
    	isWaiting = false
    	game.scene.start('SceneGoToQuestionnaire');
    });

    socket.on('New gameRound starts', function(data) {
    	// console.log('New gameRound ' + (data.gameRound+1) + ' with gameType = ' + taskOrder[data.gameRound] + ' starts!');
    	// Destroying the objects in the feedback scene
    	// payoffText.destroy();
     //    waitOthersText.destroy();
        for (let i =1; i<numOptions+1; i++) {
        	objects_feedbackStage['box'+i].destroy();
        }
    	// reset the previous data
    	// currentTrial = 1;
    	mySocialInfo = [];
        myPublicInfo = [];
        choiceOrder = [];
        share_or_not = [];
    	totalPayoff_perIndiv_perGame[gameRound] = data.totalPayoff_perIndiv_perGame[gameRound];
    	totalPayoff_perIndiv = 0;
    	groupTotalScore = 0;
    	gameRound = data.gameRound;
    	optionOrder = data.optionOrder; // new option order
    	if (numOptions == 2) {
        	settingRiskDistribution(taskOrder[data.gameRound]);
        } else {
        	// console.log('data.numOptions != 2 why????');
        }
    	// starting the new game round
    	game.scene.stop('ScenePayoffFeedback');
    	isWaiting = false
    	game.scene.start('SceneGoToNewGameRound');
    });

    socket.on('S_to_C_welcomeback', function(data) {
    	// if (waitingRoomFinishedFlag == 1) {
    	if (understandingCheckStarted == 1) {
	    	// You could give a change to the shortly disconnected client to go back to the session
	    	// However, for now I just redirect them to the questionnaire
	        socket.io.opts.query = 'sessionName=already_finished';
	        socket.disconnect();
	        window.location.href = htmlServer + portnumQuestionnaire +'/questionnaireForDisconnectedSubjects?amazonID='+amazonID+'&info_share_cost='+info_share_cost+'&bonus_for_waiting='+waitingBonus+'&totalEarningInCent='+Math.round((totalPayoff_perIndiv*cent_per_point))+'&confirmationID='+confirmationID+'&exp_condition='+exp_condition+'&indivOrGroup='+indivOrGroup+'&completed='+0+'&latency='+submittedLatency;
	        // console.log('Received: "S_to_C_welcomeback": client = '+data.sessionName +'; room = '+data.roomName);
	    } else if (waitingRoomFinishedFlag != 1) {
	    	// console.log('Received: "S_to_C_welcomeback" but the waiting room is not finished yet: client = '+data.sessionName +'; room = '+data.roomName);
	    	if (typeof restTime != 'undefined') {
	    		socket.emit('this is the previous restTime', {restTime: restTime});
	    	}
	    } else {
	    	// console.log('Received: "S_to_C_welcomeback" but the understanding test is not started yet: client = '+data.sessionName +'; room = '+data.roomName);
	    }
    });

} // window.onload -- end
