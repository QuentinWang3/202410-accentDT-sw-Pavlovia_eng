/*
- goal: This JS file is designed for a accent discrimination task used to probe L2 learners' capability to differentiate different L2 English accents as well as the difference between native speakers' accent and L2 English accents.
- created: 2024-11-05
- last modified: 2024-12-20
- change log:
    2025-02-26
    - change the lang to ENG
    - (done) added browser check
    2024-12-05
    - (done) add break time
    - (done) description of "訛りの発音" (accented speech)
    - (done) add informed consent
    - (done) add background information collection
    - (done) move experiment to github 
    2024-11-28
    - (done) preload at one time
    - (done) mark different phases (data:{phase: prac/experiment})

*/

let participant_name = "";


const jsPsych = initJsPsych({
    use_webaudio:false,
    show_progress_bar:true,
    on_finish: function(){
        jsPsych.data.displayData();
    },
});

/* init connection with pavlovia.org */
var pavlovia_init = {
    type: jsPsychPavlovia,
    command: "init",
};

var prac_audio_preload = 
prac_timeline_variable.map(function(obj){
    return [obj.Sound1, obj.Sound2];
}).flat(1);

var sent_audio_preload = 
sent_timeline_variable.map(function(obj){
    return [obj.Sound1, obj.Sound2];
}).flat(1);

var word_audio_preload = 
word_timeline_variable.map(function(obj){
    return [obj.Sound1, obj.Sound2];
}).flat(1);

//done - preload practice & main trial at the same time
    //concatenate two preload dataset
var all_audio_preload = prac_audio_preload.concat(sent_audio_preload, word_audio_preload);


var preload = {
    type: jsPsychPreload,
    audio: all_audio_preload,
};

//basic information collection

var name_input = {
    type: jsPsychSurveyText,
    questions: [
      {prompt: `
      <div style="display: flex; align-items: center;">
        <span style="white-space: nowrap; margin-right: 10px; font-size: 30px; line-height: 1.5">お名前をローマ字で入力してください：</span>
      </div>`, placeholder: "Yamada Taro", name: 'participant_name', required: true}
    ],
    on_finish: function(data) {
      // 将姓名保存到全局数据中
      jsPsych.data.addProperties({
        participant_name: data.response.participant_name
      });
      
      // 动态更新 pavlovia_finish 的 participantID
      pavlovia_finish.participantID = data.response.participant_name;
    }
  };


//volume test trial
var vol_test_audio = {
    type: jsPsychHtmlButtonResponse,
    stimulus:`
    <h1>
    Before starting the experiment, please adjust the volume.
    </h1>
    <p>
    Please press the "Play" button below and adjust the volume while checking until it reaches an appropriate level.
    </p>

    <audio id="vol-test-stimulus" src="stimuli/word/FAS_E1M-LNTW-01-16.wav"></audio>
    <button id="play-button">Play</button>
    
    <p>
    
    You can play the audio as many times as you like until the volume suits your preference.
    Once you've adjusted the volume to a level that is the easiest to hear and most comfortable for you.
    
    Press the button below and enter what you heard on the next page.
    This is just to confirm that you can hear the audio clearly, so it's okay if you make a few mistakes.
    </p>
  `,
  choices: ['Proceed to the Input Screen'],
  on_load: function() {
    var audioElement = document.getElementById('vol-test-stimulus');
    var playButton = document.getElementById('play-button');

    playButton.addEventListener('click', function() {
      audioElement.play();
    });
  }
};
  
var vol_test_input = {
    type: jsPsychSurveyText,
    questions: [
      {prompt: `
      <div style="display: flex; align-items: center;">
        <span style="white-space: nowrap; margin-right: 10px; font-size: 30px; line-height: 1.5">
        Please enter the English word you heard.：
        </span>
      </div>`, placeholder:"the English word you've heard", name: "vol-word", required: true, rows: 3, columns: 50}
    ]
};

var vol_test = {
    timeline: [vol_test_audio, vol_test_input],
};

//fullscreen before experiment
var fullscreen = {
    type: jsPsychFullscreen,
    message: `
    <h1 style="font-size: 40px; text-align: left;">
    Before Starting the Experiment: Important Notes for This Experiment
    </h1>
    <p>
    ☑️ For Mac users, we recommend using a browser other than Safari.
    ☑️ Please wear headphones.
    ☑️ Kindly mute your smartphone and other smart devices.
    ☑️ Please avoid exiting full-screen mode or using other applications before the experiment is completed.

    If you have confirmed the above precautions, click the button below to switch your browser to full-screen mode.
    </p>`,
    button_label: "I have checked all the precautions. Enter full-screen mode."

};

//browser-check 
var browser_check ={
    type:jsPsychBrowserCheck
};

//Introduction
var title = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1 style = "font-size: 60px; width: 100%;">English Pronunciation Perception Experiment</h1>
    `,
    choices: [],
    trial_duration: 2000,
};


var instruction_1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1>
    Instructions: What will you do in this experiment?
    </h1>
    <p style="width:100%">
    In this experiment, two English audio clips will be played as a pair.

    The content of the audio will be displayed slightly earlier.

    While listening to the pair of audio clips and looking at the content,

    if the pair has different accents, press the <span style="background-color: yellow;">[ F ] key</span>, 

    if the pair has the same accent, press the <span style="background-color: yellow;">[ J ] key</span> 
    <u>as quickly and accurately as possible</u>

    This experiment will record the accuracy and speed of your judgments on whether the pronunciations are the same or different.
    </p>
    `,
    choices: ['Next page'],
};

var instruction_2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1>
    Instructions: What is an accented pronunciation?
    </h1>
    <p style="width: 70%">
    Your understanding of the following content is crucial to the results of this experiment, so please read it carefully.

    In this experiment, "accent" does not refer to the variations in pronunciation among native speakers. Instead, it refers to the "foreign accent" of speakers whose native language is different from English. Although native speakers have many regional pronunciation variations, this study focuses on the differences between native and non-native English speakers, as well as differences among non-native speakers whose native languages differ.

    Therefore, a "pair of English pronunciations with different accents" refers to:

    - A pair consisting of a native speaker and a non-native speaker, or
    
    - A pair of non-native speakers whose native languages are different (e.g., Speaker A whose native language is Language A and Speaker B whose native language is Language B).

    If you understand the above explanation, click the button below to proceed to the instructions on the experiment's procedure.
    </p>
    `,
    choices: ['Understood. Go to next page.'],
};


var instruction_3 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1>
    Instructions: Explanation of the Experiment Procedure
    </h1>
    <p>
    The audio will always play immediately after the fixation point (+) is displayed, so please make sure to focus on the fixation point when it appears.

    This pronunciation perception experiment is expected to take approximately 50 minutes to complete.
    There will be one break point during the experiment.
    Feel free to take a break during this time (e.g., closing your eyes, taking deep breaths, etc.).

    To respond quickly, keep your fingers on the [ F ] and [ J ] keys at all times.
    To help you get familiar with the procedure, there are 12 practice questions prepared.
    When you are ready, click the button below to proceed to the practice session.
    </p>
    `,
    choices: ['Go to practice session'],
    data: {
        phase: 'intro',
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            windowSize: `${window.innerWidth}x${window.innerHeight}`
        }
    }
};


//block 1 - practice

//fixation
var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:`
    <h1 style= "font-size: 50px">
    +
    </h1>`,
    choices: "NO_KEYS",
    trial_duration: 1000
};

//stimuli content 
var sti_content = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  function() {
        return `
            <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
            The content of this audio is 「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
            </p>`;
    },
    choices: "NO_KEYS",
    trial_duration: 500,
};

//play sound1 in prac
var sound1 = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: jsPsych.timelineVariable('Sound1'),
    choices: 'NO_KEYS',
    prompt: function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        The content of this audio is 「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>`},
    trial_ends_after_audio: true,
};

//Delay in prac
var delay = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        The content of this audio is 「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>`},
    choices: 'NO_KEYS',
    trial_duration: 500,
};

//play sound2 in prac

var sound2 = {
    type:jsPsychAudioKeyboardResponse,
    stimulus: jsPsych.timelineVariable('Sound2'),
    choices: 'NO_KEYS',
    prompt: function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        The content of this audio is 「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>`},
    trial_ends_after_audio: true
};

//response in prac (mark practice block as "practice" in response)
var prac_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        The content of this audio is 「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>
    <p style="width: 100%"> 
    Press <span style="background-color: yellow;">[ F ] key</span>if the accents are different. 
    Press <span style="background-color: yellow;">[ J ] key</span> if the accents are the same.
    <u>Please press the key accordingly.</u>
    </p>`},
    choices: ['f','j'],
    prompt: `
    <div style="display: flex; justify-content: space-around; margin-top: 20px;">
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            if different press [F] key                   
        </div>
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            if same press [J] key                   
        </div>
    </div>
        `,
    data: {
        phase: 'practice', //mark this part as practice session
        itemID: jsPsych.timelineVariable('ItemID'),
        stimulus_type: jsPsych.timelineVariable('type'),
        correct_ans: jsPsych.timelineVariable('ExpAns'),
        list: jsPsych.timelineVariable('List'),
        content: jsPsych.timelineVariable('Content'),
        sound1: jsPsych.timelineVariable('Sound1'),
        sound2: jsPsych.timelineVariable('Sound2'),
    }
};

//timeline of practice session
var prac_trial = {
    timeline: [fixation, sti_content, sound1, delay, sound2, prac_response],
    timeline_variables: prac_timeline_variable,
    randomize_order:true
};


//end of practice
var prac_end = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1 style = "width:100%">
    The practice session is now over.
    </h1>
    <p>
    If you have any questions at this point, please do not close this webpage and contact the researcher.

    If you have no questions regarding the experiment procedure, click the button below to start the experiment.
    </p>
    `,
    choices: ['I’m ready. Starting the experiment!'] 
};


//block 2 - sentence trial

var sent_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        The content of the audio is「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>
    <p style="width: 100%"> 
    Press <span style="background-color: yellow;">[ F ] key</span>if the accents are different. 
    Press <span style="background-color: yellow;">[ J ] key</span> if the accents are the same.
    <u>Please press the key accordingly.</u>
    </p>`},
    choices: ['f','j'],
    prompt: `
    <div style="display: flex; justify-content: space-around; margin-top: 20px;">
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            if different press [F] key                   
        </div>
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            if same press [J] key                   
        </div>
    </div>
    `,
    choices: ['f', 'j'],
    data: {
        phase: "sentence",
        itemID: jsPsych.timelineVariable('SentenceID'),
        stimulus_type: jsPsych.timelineVariable('type'),
        correct_ans: jsPsych.timelineVariable('ExpAns'),
        list: jsPsych.timelineVariable('List'),
        content: jsPsych.timelineVariable('Content'),
        sound1: jsPsych.timelineVariable('Sound1'),
        sound2: jsPsych.timelineVariable('Sound2'),
    },
};

var sent_trial = {
    timeline: [fixation, sti_content, sound1, delay, sound2, sent_response],
    timeline_variables: sent_timeline_variable,
    randomize_order: true,
};

//break
var breaktime = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1>
    It’s break time! Great job so far!
    </h1>
    <p style="width:100%">
    How has the experiment been so far?

    It might be challenging, but you’re almost there.

    Take a short break—move around a bit or drink some water. Please keep it within 5 minutes.

    Once you’re ready to continue, click the button below to resume the experiment.
    </p>
    `,
    choices: ["I'm OK, continue the experiment "],
    trial_duration: 300000, // 5mins
    response_ends_trial:true,
};

//after break
var after_break = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1 style="width:100%">
    Let’s get back to the experiment!
    </h1>`,
    choices: ['Continue'],
};


//word session
var word_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        The content of audio is「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>
    <p style="width: 100%"> 
    Press <span style="background-color: yellow;">[ F ] key</span>if the accents are different. 
    Press <span style="background-color: yellow;">[ J ] key</span> if the accents are the same.
    <u>Please press the key accordingly.</u>
    </p>`},
    choices: ['f','j'],
    prompt: `
    <div style="display: flex; justify-content: space-around; margin-top: 20px;">
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            if different press [F] key                   
        </div>
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            if same press [J] key                   
        </div>
    </div>
    `,
    choices: ['f', 'j'],
    data: {
        phase: "word",
        itemID: jsPsych.timelineVariable('WordID'),
        stimulus_type: jsPsych.timelineVariable('type'),
        correct_ans: jsPsych.timelineVariable('ExpAns'),
        list: jsPsych.timelineVariable('List'),
        content: jsPsych.timelineVariable('Content'),
        sound1: jsPsych.timelineVariable('Sound1'),
        sound2: jsPsych.timelineVariable('Sound2'),
    },
};

var word_trial = {
    timeline: [fixation, sti_content, sound1, delay, sound2, word_response],
    timeline_variables: word_timeline_variable,
    randomize_order: true,
};

//save the results

var save_local_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p style="width = 100%">
    The experiment result data has been uploaded. Please also save a local copy.

    Click the button below to save the experiment result file.
    </p>
    `,
    choices: ['Save the experiment result file.'],
    on_finish: function() {
        const participant_name = jsPsych.data.get().filter({trial_type: 'survey-text'}).values()[0].response.participant_name;
        const safeParticipantName = participant_name.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const timestamp = new Date();
        const formattedts = timestamp.toISOString().split('.')[0].replace(/[:.-]/g, '_');
        const fileName = `${safeParticipantName}_${formattedts}.csv`
        jsPsych.data.get().localSave('csv', fileName);
    }
};


//ending

var ending = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1 style="text-align:left; ">
    Thank you for your cooperation, and great job!
    The experiment is now completed.
    </h1>
    <p> 
    We kindly ask you to contact the researcher to inform them of the experiment’s completion and to attach the result file in an email. (email: wang.zhiyan.w1@s.mail.nagoya-u.ac.jp)

    If you have any questions, please feel free to reach out at any time.
    
    Once you have confirmed that the file has been saved, click the button below to end the experiment.
    </p>`,
    choices:["I have saved the file. End the experiment."],
    response_ends_trial: true
};

var exit_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode:false
};

/* finish connection with pavlovia.org */
var pavlovia_finish = {
    type: jsPsychPavlovia,
    command: "finish",
    participantID: "participant_name",
};


var timeline = [pavlovia_init, preload, name_input, vol_test, fullscreen, browser_check, title, instruction_1, instruction_2, instruction_3, prac_trial, prac_end, sent_trial, breaktime, after_break, word_trial, pavlovia_finish, save_local_trial, ending,  exit_fullscreen];

jsPsych.run(timeline);