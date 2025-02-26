/*
- goal: This JS file is designed for a accent discrimination task used to probe L2 learners' capability to differentiate different L2 English accents as well as the difference between native speakers' accent and L2 English accents.
- created: 2024-11-05
- last modified: 2024-12-20
- change log:
    2025-02-26
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
    実験を始める前に、音量調節をお願いいたします。
    </h1>
    <p>
    適切な音量に調節するまで、下の「再生」ボタンを押して、音量を確認しながら調節してください。
    </p>

    <audio id="vol-test-stimulus" src="stimuli/word/FAS_E1M-LNTW-01-16.wav"></audio>
    <button id="play-button">再生する</button>
    
    <p>
    
    音量が自分の好みになるまで何回でも再生可能です。
    「この音量で一番聞き取れやすくて、負担がない」と自分にとって最適な音量に調節できたら、
    
    下のボタンを押して、次のページで聞いた内容を入力してください。
    音量がちゃんと聞こえるように調節したと確認のためなので、少し間違っていても構いません。
    </p>
  `,
  choices: ['入力画面に進む'],
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
        聞いた英単語を入力してください：
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
    実験を始める前に：本実験の注意事項
    </h1>
    <p>
    ☑️ Macの場合は、お手数をおかけしますが、Safari以外のブラウザがおすすめです。
    ☑️ ヘッドホンのご装着をお願いいたします。
    ☑️ スマホや他のスマートデバイスをミュートにしていただけますよう、お願いいたします。
    ☑️ 実験が終わる前に、全画面モードの終了や他のアプリのご使用をお控えますよう、よろしくお願いいたします。

    上記の注意事項を確認済みであれば、下のボタンをクリックすると、ブラウザが全画面モードに変わります。
    </p>`,
    button_label: "注意事項を全部確認しました。全画面モードに入ります。"

};

//browser-check 
var browser_check ={
    type:jsPsychBrowserCheck
};

//Introduction
var title = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1 style = "font-size: 60px; width: 100%;">英語発音の知覚実験</h1>
    `,
    choices: [],
    trial_duration: 2000,
};


var instruction_1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1>
    インストラクション：この実験では何をするの？
    </h1>
    <p style="width:100%">
    この実験では２つの英語の音声がペアで流されます。

    音声の内容は少し早く見られるように設定されています。

    音声の内容を見ながら、流された２つの音声を聞き、

    違う訛りの英語発音ペアであれば<span style="background-color: yellow;">[ F ]キー</span>を、

    同じ訛りの英語発音ペアであれば <span style="background-color: yellow;">[ J ]キー</span>を<u>できるだけ早く正確に</u>押してください。

    この実験では同じ発音／違う発音の判断をする際の正答率が記録されます。
    </p>
    `,
    choices: ['「訛りの発音」次のページへ'],
};

var instruction_2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1>
    インストラクション：訛りの発音とは？
    </h1>
    <p style="width: 70%">
    以下の内容に対するご理解は、本実験の結果に重要な影響がありますので、読んでいただけますよう、よろしくお願いいたします。

    本実験では、「訛り」というのは、母語話者の発音のバリエーションではなく、母語が異なる話者が持つ「母語訛り」のことを指しています。母語話者の発音は地域によって、多くのバリエーションが存在しますが、本研究が重視しているのは母語話者と非母語話者の英語発音の違い、かつ母語が異なる非母語話者間の違いです。

    つまり、「違う訛りの英語発音ペア」というのは母語話者と非母語話者の英語発音ペア、あるいはA母語の非母語話者とB母語の非母語話者の英語発音ペアです。

    上記の内容が理解できましたら、下のボタンを押すと、実験の手順に関する説明に入ります。
    </p>
    `,
    choices: ['理解できました、次のページへ'],
};


var instruction_3 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1>
    インストラクション：実験の手順に関するご説明
    </h1>
    <p>
    音声は常に凝視点（＋）の直後に流されますので、凝視点（＋）が提示されたら、必ずそのポイントに注目してください。

    この発音知覚実験はおおむね５０分程度で終了の予定ですが、途中で休憩ポイントが1回あります。
    休憩ポイントでは遠慮なく休憩してください（例：目を閉じるや深呼吸等）。

    ボタンを早く押すために、常に[ F ]と[ J ]のキーの上に指を置いてください。
    まず実験の手順に慣れていただくために、練習を１２問準備しました。
    準備ができましたら、 下のボタンを押して練習へ進んでください。
    </p>
    `,
    choices: ['練習のセッションへ'],
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
            音声の内容は「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
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
        音声の内容は「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>`},
    trial_ends_after_audio: true,
};

//Delay in prac
var delay = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        音声の内容は「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
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
        音声の内容は「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>`},
    trial_ends_after_audio: true
};

//response in prac (mark practice block as "practice" in response)
var prac_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        音声の内容は「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>
    <p style="width: 100%"> 
    違う訛りの英語発音であれば<span style="background-color: yellow;">[ F ]キー</span>を、同じ訛りの英語発音であれば <span style="background-color: yellow;">[ J ]キー</span>を<u>押してください</u>。
    </p>`},
    choices: ['f','j'],
    prompt: `
    <div style="display: flex; justify-content: space-around; margin-top: 20px;">
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            違うの場合は [F] キーを                   
        </div>
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            同じの場合は [J] キーを                   
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
    練習はこれで終わりです。
    </h1>
    <p>
    この時点でご質問等ありましたら、Webページを閉じずに、研究員にお尋ねください。

    実験の手順に関してご質問がないようでしたら、下のボタンを押すと、実験が始まります。
    </p>
    `,
    choices: ['準備できました、実験を始めます！'] 
};


//block 2 - sentence trial

var sent_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        音声の内容は「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>
    <p style="width: 100%"> 
    違う訛りの英語発音であれば<span style="background-color: yellow;">[ F ]キー</span>を、同じ訛りの英語発音であれば <span style="background-color: yellow;">[ J ]キー</span>を<u>押してください</u>。
    </p>`},
    choices: ['f','j'],
    prompt: `
    <div style="display: flex; justify-content: space-around; margin-top: 20px;">
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            違うの場合は [F] キーを                   
        </div>
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            同じの場合は [J] キーを                   
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
    休憩のお時間です！お疲れ様です！
    </h1>
    <p style="width:100%">
    これまでの実験、いかがですか？

    大変かと思いますが、あと少しで終わります。

    少し体を動かしたり、水分補給をしたりして、５分以内の休憩を取りましょう。

    休憩が終わりましたら、下のボタンを押して、実験を続けてください。
    </p>
    `,
    choices: ['休憩完了です。'],
    trial_duration: 300000, // 5mins
    response_ends_trial:true,
};

//after break
var after_break = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1 style="width:100%">
    実験に戻りましょう！
    </h1>`,
    choices: ['続けます！'],
};


//word session
var word_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  function() {
        return `
        <p style= "white-space: nowrap;text-align: center; padding: 20px; background-color: lightgray;">
        音声の内容は「<strong>${jsPsych.timelineVariable('Content')}</strong>」 
        </p>
    <p style="width: 100%"> 
    違う訛りの英語発音であれば<span style="background-color: yellow;">[ F ]キー</span>を、同じ訛りの英語発音であれば <span style="background-color: yellow;">[ J ]キー</span>を<u>押してください</u>。
    </p>`},
    choices: ['f','j'],
    prompt: `
    <div style="display: flex; justify-content: space-around; margin-top: 20px;">
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            違うの場合は [F] キーを                   
        </div>
        <div style="display: inline-block; padding: 15px 25px; margin-top: 20px; border: 2px solid #007bff; border-radius: 10px; background-color: #e7f3ff; color: #007bff; font-size: 18px;">
            同じの場合は [J] キーを                   
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


//ending

var ending = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h1 style="text-align:left; ">
    ご協力ありがとうございます。大変お疲れ様です。
    実験はこれで終わります。
    </h1>
    <p> 
    お手数をおかけしますが、実験完了後、研究者にその旨をご連絡いただき、実験結果のファイルを添付してメールで送信してください。

    また、ご質問がございましたら、いつでもご連絡いただければ幸いです。
    
    ファイルを保存したと確認できたら、下のボタンを押していただいて、実験が終わります。
    </p>`,
    choices:["ファイルを保存しました。実験を終わります。"],
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


var save_local_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p style="width = 100%">
    実験結果データはアップロードしました。ローカルでの保存もお願いいたします。

    下のボタンを押して、実験結果のファイルを保存してください。
    </p>
    `,
    choices: ['実験結果ファイルを保存します。'],
    on_finish: function() {
        const participant_name = jsPsych.data.get().filter({trial_type: 'survey-text'}).values()[0].response.participant_name;
        const safeParticipantName = participant_name.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const timestamp = new Date();
        const formattedts = timestamp.toISOString().split('.')[0].replace(/[:.-]/g, '_');
        const fileName = `${safeParticipantName}_${formattedts}.csv`
        jsPsych.data.get().localSave('csv', fileName);
    }
};


var timeline = [pavlovia_init, preload, name_input, vol_test, fullscreen, browser_check, title, instruction_1, instruction_2, instruction_3, prac_trial, prac_end, sent_trial, breaktime, after_break, word_trial, pavlovia_finish, save_local_trial, ending,  exit_fullscreen];

jsPsych.run(timeline);