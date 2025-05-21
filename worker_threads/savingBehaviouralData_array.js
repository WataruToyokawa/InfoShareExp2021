const {parentPort, workerData, isMainThread, threadId} = require('worker_threads');
const mongoose = require('mongoose');
const dbName = 'mongodb://127.0.0.1:27017/katjaExp';
// defining a model
const Behaviour = require('../models/behaviouralData');

async function runWorker() {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbName, { useNewUrlParser: true, useUnifiedTopology: true});
    const roomInfo = workerData[0]?.room || 'undefined';
    console.log(` - Connected successfully to server (room: ${roomInfo})`);

    // Save all behaviours
    
    for (let i = 0; i < workerData.length; i++) {
      let this_workerData = workerData[i];
      //console.log('this workerData\'s optionOder is: '+this_workerData.optionOrder);
      let behaviour = new Behaviour();
      behaviour.date = this_workerData.date;
      behaviour.time = this_workerData.time;
      behaviour.exp_condition = this_workerData.exp_condition;
      behaviour.indivOrGroup = this_workerData.indivOrGroup;
      behaviour.groupSize = this_workerData.groupSize;
      behaviour.room = this_workerData.room;
      behaviour.confirmationID = this_workerData.confirmationID;
      behaviour.subjectNumber = this_workerData.subjectNumber;
      behaviour.subjectID = this_workerData.subjectID;
      behaviour.trial = this_workerData.trial;
      behaviour.gameRound = this_workerData.gameRound;
      behaviour.gameType = this_workerData.gameType;
      behaviour.chosenOptionID = this_workerData.chosenOptionID;
      behaviour.individual_payoff = this_workerData.individual_payoff;
      behaviour.groupCumulativePayoff = this_workerData.groupCumulativePayoff;
      behaviour.groupTotalPayoff = this_workerData.groupTotalPayoff;
      behaviour.dataType = this_workerData.dataType;
      behaviour.timeElapsed = this_workerData.timeElapsed;
      behaviour.latency = this_workerData.latency;
      behaviour.socialFreq_0 = this_workerData.socialFreq[0]; //[this_workerData.optionOrder[0] - 1];
      behaviour.socialFreq_1 = this_workerData.socialFreq[1]; //[this_workerData.optionOrder[1] - 1];
      behaviour.socialFreq_2 = this_workerData.socialFreq[2]; //[this_workerData.optionOrder[2] - 1];
      behaviour.chosenOptionLocation = this_workerData.chosenOptionLocation;
      behaviour.maxGroupSize = this_workerData.maxGroupSize;
      behaviour.optionOrder_0 = this_workerData.optionOrder_0;
      behaviour.optionOrder_1 = this_workerData.optionOrder_1;
      behaviour.optionOrder_2 = this_workerData.optionOrder_2;
      behaviour.true_payoff_0 = this_workerData.true_payoff_0;
      behaviour.true_payoff_1 = this_workerData.true_payoff_1;
      behaviour.true_payoff_2 = this_workerData.true_payoff_2;
      behaviour.reactionTime = this_workerData.reactionTime;
      behaviour.this_env = this_workerData.this_env;

      // let dummyInfo0 = new Array(this_workerData.maxGroupSize).fill(-1);

      // if (this_workerData.dataType == 'choice') {
      //   // ---------
      //   for(let j=0; j<this_workerData.maxGroupSize; j++) {
      //     if (j < 10) {
      //       eval('behaviour.socialInfo_0'+j+'= dummyInfo0['+j+'];');
      //       // eval('behaviour.publicInfo_0'+j+'= dummyInfo0['+j+'];');
      //     } else {
      //       eval('behaviour.socialInfo_'+j+'= dummyInfo0['+j+'];');
      //       // eval('behaviour.publicInfo_'+j+'= dummyInfo0['+j+'];');
      //     }
      //   }

      //   if(behaviour.trial>1){
      //     if(typeof this_workerData.socialInfo != 'undefined') {
      //       for(let j = 0; j < this_workerData.socialInfo.length; j++) {
      //         if ( j < 10) {
      //           eval('behaviour.socialInfo_0'+j+'= this_workerData.socialInfo['+j+'];');
      //           // eval('behaviour.publicInfo_0'+j+'= this_workerData.publicInfo['+j+'];');
      //         } else {
      //           eval('behaviour.socialInfo_'+j+'= this_workerData.socialInfo['+j+'];');
      //           // eval('behaviour.publicInfo_'+j+'= this_workerData.publicInfo['+j+'];');
      //         }
      //       }
      //     }else{
      //       console.log(` - [Worker] this_workerData.socialInfo is undefined!`);
      //     }
      //   }
      //   // ---------
      // }

      behaviour.save(function(err){
        if(err) console.log(`err at worker ${this_workerData.subjectID}.`);
        // console.error('Worker error:', err); // Log stack trace and message
        if(i == workerData.length - 1) {
          // let now = new Date()
          //       , logdate = '[' + now.getUTCFullYear() + '/' + (now.getUTCMonth() + 1) + '/'
          //     ;
          // logdate += now.getUTCDate() + '/' + now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds() + ']';      
          console.log(` - [Worker] isMainThread: ${isMainThread}, behaviour of ${this_workerData.room} saved`);
          process.exit();
          parentPort.postMessage(`[Worker] Finished ${this_workerData.room}`);
        }
      });
    }
  } catch (err) {
    console.error('MongoDB connection or processing error:', err);
    process.exit(1);
  }
}

runWorker();






