const handpose = require('@tensorflow-models/handpose')
const fp       = require('fingerpose')

require('@tensorflow/tfjs-backend-webgl');

import Rock  from './GesturePose/Rock.js'
import Paper from './GesturePose/Paper.js'
import Start from './GesturePose/Start.js'


const GE = new fp.GestureEstimator([
    fp.Gestures.VictoryGesture,
    fp.Gestures.ThumbsUpGesture,
    Rock, Paper, Start
]);

var video, canvas, context, model, loader, status_label;

var gameStarted = false
const computerOptions = ['rock','paper','scissors']
var computerChoice, waitPlayer = false;

document.addEventListener('DOMContentLoaded', () => {
    video   = document.getElementById('video-input')
    canvas  = document.getElementById('video-out')
    loader  = document.getElementById('loader')
    context = canvas.getContext('2d')
    status_label = document.getElementById('status')

    camEvent()

    loadModel().then(() => {
        console.log('model loaded: ', model);
        loader.style.display = 'none'
        canvas.style.display = 'block'

        startCam()
    })

})

async function loadModel(){
    model = await handpose.load();
}

function startCam(){
    if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 720 }, 
                height: { ideal: 480 } 
            }
        })
        .then((stream) => {
            video.srcObject = stream
        }).catch(error => {
            console.log(error);
        })
    }
}

async function drawOutPutVideo(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    let gesture = await predictHandsGesture();

    if(gameStarted && gesture){
        play(gesture)
    }else{
        if(gesture && gesture.name == 'start'){
            gameStarted = true
        }
    }

}

function camEvent(){
    video.addEventListener('loadeddata', () => {
        console.log('video data loaded');
        (async function loop(){
            if(!video.paused && !video.ended){
                drawOutPutVideo()
                setTimeout(loop, 20)
            }
        })()
    })
}

async function predictHandsGesture(){
    const predictions = await model.estimateHands(video);
    var estimatedGestures;
    var gesture;

    if(predictions.length > 0){
        estimatedGestures = GE.estimate(predictions[0].landmarks, 8.5);
        if(estimatedGestures.gestures.length > 0){
            gesture = estimatedGestures.gestures[0]
            estimatedGestures.gestures.forEach(ge => {
                if(ge.score > gesture.score) gesture = ge
            });
        }
    }
    return gesture;
}

function play(gesture){
    if(gameStarted){
        if(!waitPlayer){
            const choiceNumber = Math.floor(Math.random()*3);
            computerChoice     = computerOptions[choiceNumber]
            waitPlayer = true
        }else{
            if(gesture){
                WinnerIs(computerChoice, gesture.name)
            }            
        }
    }
}

function WinnerIs(computerChoice, playerChoice){
    let winner = ''
    switch(playerChoice){
        case 'Rock':
            if(computerChoice == 'paper')    winner = 'computer';
            if(computerChoice == 'scissors') winner = 'player';
            if(computerChoice == 'rock')     winner = 'no';
            // waitPlayer  = false
            // gameStarted = false
            break;
        case 'paper':
            if(computerChoice == 'paper')    winner = 'no';
            if(computerChoice == 'scissors') winner = 'computer';
            if(computerChoice == 'rock')     winner = 'player';
            // waitPlayer  = false
            // gameStarted = false
            break;
        case 'victory':
            if(computerChoice == 'paper')    winner = 'player';
            if(computerChoice == 'scissors') winner = 'no';
            if(computerChoice == 'rock')     winner = 'computer';

            break
        case 'start':
            status_label.innerHTML = 'Attente du choix du joueur'
            console.log('wait player');
            break;
    }

    if(winner != ''){
        waitPlayer  = false
        gameStarted = false
        console.log('winner is: ', winner);
    }
}
