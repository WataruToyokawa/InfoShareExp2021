// SceneInstruction
class SceneInstruction extends Phaser.Scene {

	constructor () {
	    super({ key: 'SceneInstruction', active: false });
	}

	preload () {
	}

	init (data) {
		//this.n = data.n;
		this.indivOrGroup = data.indivOrGroup;
		this.exp_condition = data.exp_condition;
		//console.log('indivOrGroup = ' + this.indivOrGroup);
	}

	create () {
		//console.log('instructionPosition = '+ instructionPosition);
		// background colour
		this.cameras.main.setBackgroundColor('#FFFFFF'); //#FFFFFF == 'white'


	    // Instruction length
	    let instructionLength;
	    let instructionText
	    if (this.indivOrGroup == 0) { // 0 = individual; 1 = group
	    	instructionLength = instructionText_indiv.length;
	    	instructionText = instructionText_indiv;
	    } else {
	    	instructionLength = instructionText_group.length;
	    	instructionText = instructionText_group;
	    }
	    // create a new 'div' for the instruction texts
	    const instructionTextStyle = 'background-color: rgba(51,51,51,0.1); width: 700px; height: 400px; font: 25px Arial;';
	    let instructionDiv = document.createElement('div');
	    instructionDiv.style = instructionTextStyle;
	    if (!isInstructionRevisit) {
	    	instructionDiv.innerHTML = instructionText[instructionPosition];
	    } else {
	    	instructionDiv.innerHTML = revisitingInstructionText[0];
	    }
	    instructionDiv.id = 'instructionDiv';
	    // Add the div
	    let instructionElement = this.add.dom(configWidth/2, 220, instructionDiv);

	    // instruction Picture
	    let currentInstructionPicture = [];
	    if (this.indivOrGroup == 0) {
	    	for (let i=0; i<7; i++) {
		    	currentInstructionPicture[i] = this.add.image(configWidth/2, configHeight/2, 'instructionPictures_indiv_'+i ).setDisplaySize((1024/3)*1.3, (768/3)*1.3);
		    	currentInstructionPicture[i].visible = false;
		    }
	    } else {
	    	for (let i=0; i<14; i++) {
	    		if (i != 12 & i != 8) {
		    		currentInstructionPicture[i] = this.add.image(configWidth/2, configHeight/2 - 20, 'instructionPictures_group_'+i ).setDisplaySize((1024/3)*1.4, (768/3)*1.4);
		    	} else if (i == 8) {
		    		currentInstructionPicture[i] = this.add.image(configWidth/2, configHeight/2, 'instructionPictures_group_'+i ).setDisplaySize((1024/3)*1.31, (768/3)*1.31);
	    		} else if (i == 12) {
		    		currentInstructionPicture[i] = this.add.image(configWidth/2, configHeight/2 + 10, 'instructionPictures_group_'+i ).setDisplaySize((1024/3)*1.31, (768/3)*1.31);
		    	}
		    	currentInstructionPicture[i].visible = false;
		    }
	    }


	    // next button
	    this.nextButtonContainer = this.add.container(550, 520);
		let nextButtonImage = this.add.sprite(0, 0, 'button').setDisplaySize(200,150).setInteractive({ cursor: 'pointer' });
		let nextButtonText = this.add.text(0, 0, 'Next', { fontSize: '32px', fill: '#000' });
		nextButtonText.setOrigin(0.5, 0.5);
		this.nextButtonContainer.add(nextButtonImage);
		this.nextButtonContainer.add(nextButtonText);
	    nextButtonImage.on('pointerdown', function (pointer) {
	    	if(instructionPosition < instructionLength - 1){
	    		instructionPosition += 1;
	    		instructionDiv.innerHTML = instructionText[instructionPosition];
	    		backButtonImage.visible = true;
	    		backButtonText.visible = true;
	    		if (instructionPosition == instructionLength - 1 & isInstructionRevisit) {
	    			instructionDiv.innerHTML = revisitingInstructionText[1];
	    		}
	    		if (instructionPosition < instructionLength - 1) {
	    			currentInstructionPicture[instructionPosition - 1].visible = false;
	    			currentInstructionPicture[instructionPosition].visible = true;
				} else {
					currentInstructionPicture[instructionPosition - 1].visible = false;
					if(typeof currentInstructionPicture[instructionPosition] != 'undefined') {
	    				currentInstructionPicture[instructionPosition].visible = false;
					}
				}
	    	} else {
	    		if (!isInstructionRevisit) {
	    			this.scene.start('SceneTutorial', { indivOrGroup: indivOrGroup, exp_condition: exp_condition, tutorialPosition:0 });
	    			nextButtonImage.visible = false;
	    			backButtonImage.visible = false;
	    			//nextButtonContainer.destroy();
	    			//backButtonContainer.destroy();
	    		} else {
	    			answers = [-1,-1,-1,-1,-1];
	    			this.scene.start('SceneUnderstandingTest');
	    			nextButtonImage.visible = false;
	    			backButtonImage.visible = false;
	    		}
	    	}
	    }, this);
	    // back button
	    this.backButtonContainer = this.add.container(250, 520);
		let backButtonImage = this.add.sprite(0, 0, 'button').setDisplaySize(200,150).setInteractive({ cursor: 'pointer' });
		let backButtonText = this.add.text(0, 0, 'back', { fontSize: '32px', fill: '#000' });
		backButtonText.setOrigin(0.5, 0.5);
		this.backButtonContainer.add(backButtonImage);
		this.backButtonContainer.add(backButtonText);
		backButtonImage.visible = false;
		backButtonText.visible = false;
	    backButtonImage.on('pointerdown', function (pointer) {
	    	if(instructionPosition>0){
	    		instructionPosition -= 1;
	    		instructionDiv.innerHTML = instructionText[instructionPosition];
	    		if (instructionPosition > 0) {
	    			if(typeof currentInstructionPicture[instructionPosition + 1] != 'undefined') {
	    				currentInstructionPicture[instructionPosition + 1].visible = false;
	    			}
	    			currentInstructionPicture[instructionPosition].visible = true;
				} else {
					backButtonImage.visible = false;
					backButtonText.visible = false;
					currentInstructionPicture[instructionPosition + 1].visible = false;
	    			currentInstructionPicture[instructionPosition].visible = false;
				}
	    	}
	    });
	    // pointerover
		backButtonImage.on('pointerover', function (pointer) {
	    	backButtonImage.setTint(0x4c4c4c); //B8860B ff0000
	    }, this);
	    nextButtonImage.on('pointerover', function (pointer) {
	    	nextButtonImage.setTint(0x4c4c4c); //008B8B
	    }, this);
	    // pointerout
		backButtonImage.on('pointerout', function (pointer) {
	    	backButtonImage.clearTint();
	    }, this);
	    nextButtonImage.on('pointerout', function (pointer) {
	    	nextButtonImage.clearTint();
	    }, this);
	}

	update(){
	}
};

export default SceneInstruction;
