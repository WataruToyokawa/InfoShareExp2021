// SceneWaitingRoom0

import {rand
	, isNotNegative
	, BoxMuller
	, sum
	, waitingBarCompleted
	, debug_pointerdown
	, sending_core_is_ready
	, goToQuestionnaire
	, settingConfirmationID
	, testFunction
} from '../functions.js';


// SceneWaitingRoom0
class SceneWaitingRoom0 extends Phaser.Scene {

	// make it public so that other scene can access to it (?)
	//public sprite: Phaser.GameObjects.Sprite;

	constructor (){
	    super({ key: 'SceneWaitingRoom0', active: true });
	}

	preload(){
		// progress bar
		let progressBox = this.add.graphics();
		let progressBar = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, 270, 320, 50);
		// loading text
		let width = this.cameras.main.width;
		let height = this.cameras.main.height;
		let loadingText = this.make.text({
		    x: width / 2,
		    y: height / 2 - 50,
		    text: 'Loading...',
		    style: {
		        font: '20px',
		        fill: nomalTextColor
		    }
		});
		loadingText.setOrigin(0.5, 0.5);
		// percent text
		let percentText = this.make.text({
		    x: width / 2,
		    y: height / 2 - 5,
		    text: '0%',
		    style: {
		        font: '18px monospace',
		        fill: '#ffffff'
		    }
		});
		percentText.setOrigin(0.5, 0.5);
		// loading stuff
		this.load.image('star', 'assets/star.png');
		//this.load.image('trap', 'assets/wana_hakowana.png');
	    //this.load.image('lancer', 'assets/war_trident.png');
	    this.load.image('button', 'assets/button.001.png');
	    this.load.image('button_active', 'assets/button.active.png');
		this.load.image('bonusBarFrame', 'assets/bar.png');
		this.load.image('bonusBar', 'assets/scaleOrange.png');
		this.load.image('perfectImg', 'assets/PERFECT.png');
		this.load.image('startImg', 'assets/start.png');
		this.load.image('energycontainer', 'assets/energycontainer.png');
		this.load.image('energybar', 'assets/energybar.png');
		// this.load.image('machine1_normal', 'assets/machine_normal_1.png');
		// this.load.image('machine2_normal', 'assets/machine_normal_2.png');
		// this.load.image('machine3_normal', 'assets/machine_normal_3.png');
		// this.load.image('machine4_normal', 'assets/machine_normal_4.png');
		// this.load.image('machine1_active', 'assets/machine_active_1.png');
		// this.load.image('machine2_active', 'assets/machine_active_2.png');
		// this.load.image('machine3_active', 'assets/machine_active_3.png');
		// this.load.image('machine4_active', 'assets/machine_active_4.png');
		this.load.image('machine1_normal', 'assets/slot1_normal.png');
		this.load.image('machine2_normal', 'assets/slot2_normal.png');
		this.load.image('machine3_normal', 'assets/slot3_normal.png');
		this.load.image('machine4_normal', 'assets/slot4_normal.png');
		this.load.image('machine5_normal', 'assets/slot5_normal.png');
		this.load.image('machine6_normal', 'assets/slot6_normal.png');
		this.load.image('machine7_normal', 'assets/slot7_normal.png');
		this.load.image('machine8_normal', 'assets/slot8_normal.png');
		this.load.image('machine1_active', 'assets/slot1_active.png');
		this.load.image('machine2_active', 'assets/slot2_active.png');
		this.load.image('machine3_active', 'assets/slot3_active.png');
		this.load.image('machine4_active', 'assets/slot4_active.png');
		this.load.image('machine5_active', 'assets/slot5_active.png');
		this.load.image('machine6_active', 'assets/slot6_active.png');
		this.load.image('machine7_active', 'assets/slot7_active.png');
		this.load.image('machine8_active', 'assets/slot8_active.png');
		this.load.image('instructionPictures_indiv_1', 'assets/instructionPictures_indiv.001.png');
		this.load.image('instructionPictures_indiv_2', 'assets/instructionPictures_indiv.002.png');
		this.load.image('instructionPictures_indiv_3', 'assets/instructionPictures_indiv.003.png');
		this.load.image('instructionPictures_indiv_4', 'assets/instructionPictures_indiv.004.png');
		this.load.image('instructionPictures_indiv_5', 'assets/instructionPictures_indiv.005.png');
		this.load.image('instructionPictures_indiv_6', 'assets/instructionPictures_indiv.006.png');

		this.load.image('instructionPictures_group_1', 'assets/instructionPictures_group.001.png');
		this.load.image('instructionPictures_group_2', 'assets/instructionPictures_group.002.png');
		this.load.image('instructionPictures_group_3', 'assets/instructionPictures_group.003.png');
		this.load.image('instructionPictures_group_4', 'assets/instructionPictures_group.004.png');
		this.load.image('instructionPictures_group_5', 'assets/instructionPictures_group.005.png');
		this.load.image('instructionPictures_group_6', 'assets/instructionPictures_group.006.png');
		this.load.image('instructionPictures_group_7', 'assets/instructionPictures_group.007.png');
		this.load.image('instructionPictures_group_8', 'assets/instructionPictures_group.008.png');
		this.load.image('instructionPictures_group_9', 'assets/instructionPictures_group.009.png');
		this.load.image('instructionPictures_group_10', 'assets/instructionPictures_group.010.png');
		this.load.image('instructionPictures_group_11', 'assets/instructionPictures_group.011.png');
		this.load.image('instructionPictures_group_12', 'assets/instructionPictures_group.012.png');
		this.load.image('instructionPictures_group_13', 'assets/instructionPictures_group.013.png');
		this.load.image('net_contribution', 'assets/net_contribution.png');
		this.load.image('pointing_finger', 'assets/pointing_finger.png');

		// this.load.image('instructionPictures_4ab_1', 'assets/instructionPictures_4ab.001.png');
		// this.load.image('instructionPictures_4ab_2', 'assets/instructionPictures_4ab.002.png');
		// this.load.image('instructionPictures_4ab_3', 'assets/instructionPictures_4ab.003.png');
		// this.load.image('instructionPictures_4ab_4', 'assets/instructionPictures_4ab.004.png');
		// this.load.image('instructionPictures_4ab_5', 'assets/instructionPictures_4ab.005.png');
		// this.load.image('instructionPictures_4ab_6', 'assets/instructionPictures_4ab.006.png');
		// this.load.image('instructionPictures_4ab_7', 'assets/instructionPictures_4ab.007.png');
		// this.load.image('instructionPictures_4ab_8', 'assets/instructionPictures_4ab.008.png');
		// this.load.image('instructionPictures_4ab_9', 'assets/instructionPictures_4ab.009.png');
		this.load.image('blackbox', 'assets/blackbox.png');
		// progress bar functions
		this.load.on('progress', function (value) {
		    ////console.log(value);
		    progressBar.clear();
		    progressBar.fillStyle(0xffffff, 1);
		    progressBar.fillRect(250, 280, 300 * value, 30);
		    percentText.setText(parseInt(value * 100) + '%');
		});
		this.load.on('fileprogress', function (file) {
		    //console.log(file.src);
		});
		this.load.on('complete', function () {
		    // console.log('preloading is completed!: core is ready');
		    isPreloadDone = true;
		    progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			sending_core_is_ready(isPreloadDone)
			// if(!isWaitingRoomStarted) {
			// 	socket.emit('loading completed');
			// }
			// execute if preload completed later than on.connection('this is your parameter')
			//if(isEnvironmentReady) game.scene.start('SceneWaitingRoom');
			//======== letting the server know latency with this client ==========
		    // after calculating the first average latency
		    // the client should be put into the individual condition
		    // sending_core_is_ready(isPreloadDone);
		    //socket.emit('core is ready', {latency: 0, maxLatencyForGroupCondition: maxLatencyForGroupCondition});

		    // setTimeout(function(){
		    //     submittedLatency = sum(averageLatency)/averageLatency.length;
		    //     socket.emit('core is ready', {latency: submittedLatency, maxLatencyForGroupCondition: maxLatencyForGroupCondition});
		    //     $("#latency").val(submittedLatency);
		    // }, averageLatency.length*1000+500);

		    //======== end: letting the server know latency with this client ==========
		});
	}

	create(){
		// background colour
		this.cameras.main.setBackgroundColor('#FFFFFF'); //#FFFFFF == 'white'
		// text styles
		const textStyle =
			{ fontSize: '24px', fill: nomalTextColor, wordWrap: { width: configWidth-80, useAdvancedWrap: true } };
		const noteStyle =
			{ fontSize: '24px', fill: noteColor, wordWrap: { width: configWidth-80, useAdvancedWrap: true }, fontstyle: 'bold' };
		//  Texts
	    let title = this.add.text(configWidth/2, 18, waitingRoomText0[0], { fontSize: '36px', fill: '#000', fontstyle: 'bold' });
	    let note1 = this.add.text(configWidth/2, 70, waitingRoomText0[1], textStyle);
	    let note2 = this.add.text(configWidth/2, 70+30*2, waitingRoomText0[2], textStyle);
	    let note3 = this.add.text(configWidth/2, 70+30*4, waitingRoomText0[3], noteStyle);
	    title.setOrigin(0.5, 0.5);
	    note1.setOrigin(0.5, 0.5);
	    note2.setOrigin(0.5, 0.5);
	    note3.setOrigin(0.5, 0.5);
	}

	update(){
		emitting_time += 1/(3*this.game.loop.actualFps) // incrementing every 3 seconds
		if (!isWaitingRoomStarted & emitting_time % 3 == 0) {
			sending_core_is_ready(isPreloadDone)
		}
	}
};

export default SceneWaitingRoom0;
