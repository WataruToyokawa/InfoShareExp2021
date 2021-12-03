// SceneMain -- main scene; experimental task

import {rand
	, isNotNegative
	, BoxMuller
	, sum
	, waitingBarCompleted
	, debug_pointerdown
	, sending_core_is_ready
	, goToQuestionnaire
	, settingConfirmationID
	, madeChoice
	, createCircle
	, showPublicInfo
} from '../functions.js';

class SceneMain extends Phaser.Scene {

	constructor (){
	    super({ key: 'SceneMain', active: false });

	    this.count = 0;
	}

	preload(){
		}

	init (data) {
		this.gameRound = data.gameRound;
		this.round = data.round;
	}

	create(){

		// console.log('restarting the main scene!: mySocialInfo = '+data.socialFreq[data.round-1]);

		// background colour
		this.cameras.main.setBackgroundColor('#FFFFFF');
		//console.log('SceneMain started. currentTrial: ' + currentTrial);
		// options
		// slot machines and choice button
	    let options = {};
	    let isChoiceMade = false;
	    let slotY_main = 400;

	    let trialText_Y = 16
	    ,	groupTotalScoreText_Y = 16 + 50 * 1
	    ,	costPaidText_Y = 16 + 50 * 2
	    ,	scoreText_Y = 16 + 50 * 3
	    ,	energyBar_Y = 16 + 50 * 2 // 16 + 50 * 4
	    ;

		// Creating options
	    for (let i=1; i<numOptions+1; i++) {
	    	options['box'+i] = this.add.sprite(option1_positionX+space_between_boxes*(i-1), slotY_main, 'machine'+(i + numOptions*gameRound)+'_normal');
	    	options['box_active'+i] = this.add.sprite(option1_positionX+space_between_boxes*(i-1), slotY_main, 'machine'+(i + numOptions*gameRound)+'_active');
	    	options['box'+i].setDisplaySize(optionWidth, optionHeight).setInteractive({ cursor: 'pointer' });
	    	options['box_active'+i].setDisplaySize(optionWidth, optionHeight).setInteractive({ cursor: 'pointer' });
	    	options['box_active'+i].visible = false;
	    }

		// confirmation text
		let confirmationContainer = this.add.container(175, slotY_main+20);
		let confirmationImage = this.add.sprite(0, 0, 'button').setDisplaySize(160,100).setAlpha(0.7);
		let confirmationText = this.add.text(0, 0, `Click again\nto confirm \nyour choice`, { fontSize: '20px', fill: '#000' }).setOrigin(0.5, 0.5);
		confirmationContainer.add(confirmationImage);
		confirmationContainer.add(confirmationText);
		confirmationContainer.visible = false; // it's hidden in default

		// =============== A looking-good timer =================================
			// the energy container. A simple sprite
		let energyContainer = this.add.sprite(400, energyBar_Y+18, 'energycontainer');
			// the energy bar. Another simple sprite
    	let energyBar = this.add.sprite(energyContainer.x + 46, energyContainer.y, 'energybar');
    		// a copy of the energy bar to be used as a mask. Another simple sprite but...
    	let energyMask = this.add.sprite(energyBar.x, energyBar.y, 'energybar');
    		// ...it's not visible...
    	energyMask.visible = false;
    		// resize them
    	let energyContainer_originalWidth = energyContainer.displayWidth
    	,	energyContainer_newWidth = 200
    	,	container_bar_ratio = energyBar.displayWidth / energyContainer.displayWidth
    	;
		energyContainer.displayWidth = energyContainer_newWidth;
		energyContainer.scaleY = energyContainer.scaleX;
		energyBar.displayWidth = energyContainer_newWidth * container_bar_ratio;
    	energyBar.scaleY = energyBar.scaleX;
    	energyBar.x = energyContainer.x + (46 * energyContainer_newWidth/energyContainer_originalWidth);
    	energyMask.displayWidth = energyBar.displayWidth;
    	energyMask.scaleY = energyMask.scaleX;
    	energyMask.x = energyBar.x;
    	// and we assign it as energyBar's mask.
    	energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, energyMask);
    	// =============== A looking-good timer =================================

    	// =============== Count down =================================
    	this.timeLeft = maxChoiceStageTime / 1000;
		// a boring timer.
        let gameTimer = this.time.addEvent({
            delay: 1000,
            callback: function(){
                this.timeLeft --;

                // dividing energy bar width by the number of seconds gives us the amount
                // of pixels we need to move the energy bar each second
                let stepWidth = energyMask.displayWidth / (maxChoiceStageTime/1000);

                // moving the mask
                energyMask.x -= stepWidth;
                if (this.timeLeft < 1) {
                	// By setting "isChoiceMade" a bit earlier than
                	// the time is actually up, the two conflicting inputs,
                	// a "miss" and an "actual choice" won't be executed at the same time
                	isChoiceMade = true;
                }
                if(this.timeLeft < 0){
                    currentChoiceFlag = -1
                    for (let i=1; i<numOptions+1; i++) {
                    	options['box'+i].visible = false;
                    	options['box_active'+i].visible = false;
                    }
	    //             options.box1.visible = false;
					// options.box1_active.visible = false;
	    //             options.box2.visible = false;
					// options.box2_active.visible = false;
					madeChoice(currentChoiceFlag, 'miss', optionOrder);
					this.scene.start('ScenePayoffFeedback', {didMiss: true, flag: currentChoiceFlag});
					isWaiting = true;
					gameTimer.destroy();
                }
            },
            callbackScope: this,
            loop: true
        });
        // =============== Count down =================================

        for (let i=1; i<numOptions+1; i++) {
        	// pointerdown - normal option
        	options['box'+i].on('pointerdown', function (pointer) {
				options['box'+i].visible = false;
				options['box_active'+i].visible = true;
				confirmationContainer.x = option1_positionX + space_between_boxes*(i-1);
				confirmationContainer.visible = true;
				currentChoiceFlag = i;
				for (let j=1; j<numOptions+1; j++) {
					if(currentChoiceFlag > 0 && currentChoiceFlag != j) {
						options['box_active'+j].visible = false;
						options['box'+j].visible = true;
					}
				}
		    }, this);
        	// pointerdown - activated option
        	options['box_active'+i].on('pointerdown', function (pointer) {
		    	//clearTimeout(countDownChoiceStage);
		    	if(!isChoiceMade) {
		    		madeChoice(currentChoiceFlag, exp_condition, optionOrder);
		    		gameTimer.destroy();
		    		this.scene.start('ScenePayoffFeedback', {didMiss: false, flag: currentChoiceFlag});
		    		isWaiting = true;
		    		isChoiceMade = true;
		    		for (let j=1; j<numOptions+1; j++) {
		    			options['box'+j].visible = false;
		    		}
		    		options['box_active'+i].visible = false;
		    		confirmationContainer.visible= false;
		    	}
		    }, this);
		    // pointerover
			options['box'+i].on('pointerover', function (pointer) {
		    	options['box'+i].setTint(0xb8860b); //B8860B ff0000
		    }, this);
		    // pointerout
			options['box'+i].on('pointerout', function (pointer) {
		    	options['box'+i].clearTint();
		    }, this);
        }

	    // ------------ Texts appear above the slots
	    trialText = this.add.text(16, trialText_Y
	    	, 'Current trial: ' + currentTrial + ' / ' + horizon
	    	// , ''
	    	, { fontSize: '30px', fill: nomalTextColor });

	    groupTotalScoreText = this.add.text(16, groupTotalScoreText_Y
	    	, ''
	    	// , 'Team\'s total score: ' + groupTotalScore + ' (your share: ' + totalPayoff_perIndiv + ')'
	    	, { fontSize: '30px', fill: nomalTextColor });

	    costPaidText = this.add.text(16, costPaidText_Y
	    	, ''
	    	// , 'Sharing fee you paid: '
	    	, { fontSize: '30px', fill: nomalTextColor });
	    costPaidText_2 = this.add.text(16 + 400, costPaidText_Y
	    	, ''
	    	// , '-' + info_share_cost_total
	    	, { fontSize: '30px', fill: noteColor });

	    this.groupSizeText = this.add.text(16, scoreText_Y
	    	// , 'Total score: ' + score
	    	, 'Number of players: ' + currentGroupSize.toString()
	    	// , 'Your net score: ' + (totalPayoff_perIndiv - info_share_cost_total)
	    	, { fontSize: '30px', fill: nomalTextColor });
	    timeText = this.add.text(16, energyBar_Y
	    	, 'Remaining time: '
	    	, { fontSize: '30px', fill: nomalTextColor });

	    payoffText = this.add.text(feedbackTextPosition, slotY_main+100
	    	, ``
	    	, { fontSize: '25px', fill: nomalTextColor, align: 'center' }).setOrigin(0.5, 0.5);

	    // payoffText.setText(`You produced\n${payoff}`);

	    // // The following 'You earned $??' might be misleading as this is a group-optimization task
	    // if (didShare != 1) {
		   //  payoffText.setText(`You earned \n${payoff}`);
	    // } else {
	    // 	payoffText.setText(`You earned \n${payoff} - ${info_share_cost}`);
	    // }
	    // // ==============================================================================

	    // if(currentTrial === 1) {
	    // 	payoffText.visible = false;
	    // } else {
	    // 	payoffText.visible = false; //true;
	    // }
	    // payoffText.visible = false;
	    // --------------------------------------------

	    // social information
	    let socialFreqNumbers = {};
	    if (indivOrGroup == 1) {
	    	for (let i = 1; i < numOptions+1; i++) {
	    		socialFreqNumbers['option'+i] = this.add.text(option1_positionX + space_between_boxes*(i-1), slotY_main-80, `${mySocialInfoList['option'+i]} people`, { fontSize: '25px', fill: noteColor }).setOrigin(0.5,0.5);
	    	}
	    } else { // individual condition
	    	for (let i = 1; i < numOptions+1; i++) {
	    		socialFreqNumbers['option'+i] = this.add.text(option1_positionX + space_between_boxes*(i-1), slotY_main-80, `You chose this`, { fontSize: '25px', fill: noteColor }).setOrigin(0.5,0.5);
	    		if (mySocialInfoList['option'+i] > 0) {
	    			// console.log('mySocialInfoList option '+ i +' is visible');
	    			socialFreqNumbers['option'+i].visible = true;
	    		} else {
	    			// console.log('mySocialInfoList option '+ i +' is NOT visible');
	    			socialFreqNumbers['option'+i].visible = false;
	    		}
	    	}
	    }
	    // No social info visible
	    // (change inside of the if() when you want to show "?? people" info)
	    if(currentTrial > 0) { //-> if(currentTrial==1) {
	    	for (let i = 1; i < numOptions+1; i++) {
	    		socialFreqNumbers['option'+i].visible = false;
	    	}
	    }
	    //  Stars that are evenly spaced 70 pixels apart along the x axis
	    let numberOfPreviousChoice = [];
	    let shared_payoff = [];
	    let shared_option_position = [];
	    for (let i = 0; i < maxGroupSize; i++) {
	    	if (typeof subjectNumber != 'undefined' && share_or_not[i] != null) {
	    		if (i+1 != subjectNumber && share_or_not[i].share == 1) { // <- only info shared by others will be shown
	    			shared_payoff.push(share_or_not[i].payoff);
	    			// shared_option_position.push( optionOrder.indexOf(optionsKeyList.indexOf(mySocialInfo[i])) )
	    			shared_option_position.push(share_or_not[i].position);
	    		}
	    	}
	    }
	    for (let i = 1; i < numOptions+1; i++) {
	    	numberOfPreviousChoice[i-1] = mySocialInfoList['option'+i]
	    }

	    // --- Social frequency information (used in Toyokawa & Gaissmaier 2020)
	    // Turn this on when you want to show the frequency-information
	    // and turn off the 'publicInfo.call' in this case
	    //
	    // showStars_4ab.call(this, numberOfPreviousChoice[0], numberOfPreviousChoice[1], numberOfPreviousChoice[2], numberOfPreviousChoice[3], slotY_main-90);
	    //
	    // --------------------------------------------------------------------
	    if(this.round > 1) {
	    	showPublicInfo.call(this, shared_payoff, shared_option_position, slotY_main-90);
	    } else {
	    	// console.log('No public info should be shown!')
	    }

		// createWindow('SceneMessagePopUp'); //this.createWindow(SceneMessagePopUp); // pop up window saying 'another member has been dropped out'

	}

	update(){
		this.groupSizeText.setText('Number of players: ' + currentGroupSize.toString());
	}

};

export default SceneMain;
