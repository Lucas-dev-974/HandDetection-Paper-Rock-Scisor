const handpose = require('@tensorflow-models/handpose')
const fp       = require('fingerpose')

require('@tensorflow/tfjs-backend-webgl');

// Import des pose de maiin
import Rock  from './GesturePose/Rock.js'
import Paper from './GesturePose/Paper.js'
import Start from './GesturePose/Start.js'
import Reset from './GesturePose/Reset.js'


// Définition des route vers les images à charger
const rock_img =   'medias/rock.png',
      scisor_img = 'medias/scisor.png',
      paper_img  = 'medias/paper.png';

var computer_choice_container;

// Construction
const GE = new fp.GestureEstimator([
    fp.Gestures.VictoryGesture,
    fp.Gestures.ThumbsUpGesture,
    Rock, Paper, Start, Reset
]);

var player_score = 0, computer_score = 0;

var label_scoreP, label_scoreC;

var video, canvas, context, model, loader, status_label;

var gameStarted = false

const computerOptions = ['rock','paper','scissors']
var computerChoice;

document.addEventListener('DOMContentLoaded', () => {

    video   = document.getElementById('video-input')
    canvas  = document.getElementById('video-out')
    loader  = document.getElementById('loader')
    context = canvas.getContext('2d')

    label_scoreP = document.getElementById('scorePlayer')
    label_scoreC = document.getElementById('scorecomputer')
    
    status_label = document.getElementById('status')

    computer_choice_container = document.getElementById('computerChoiceImg');

    camEvent()

    loadModel().then(() => { 
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
        navigator.mediaDevices.getUserMedia({video: { 
            width: { ideal: 720 }, 
            height: { ideal: 480 } 
        }}).then((stream) => {
            video.srcObject = stream
        }).catch(error => {
            console.log(error);
        })
    }
}

async function drawOutPutVideo(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    let gesture = await predictHandsGesture();
    if(gesture) play(gesture)
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
    // Check si l'utilisateur maitien le geste 'pouce vers paume' | Réinitialise les score
    if(gesture.name == 'reset')
        resetScore()

    // Check si l'uilisateur maintien le geste 'OK' | Pour commancer la parti
    if(gesture.name == 'start'){
        gameStarted = true
        const choiceNumber = Math.floor(Math.random()*3);
        computerChoice     = computerOptions[choiceNumber]
    }
    
    
    if(gameStarted)
        GameLogic(computerChoice, gesture.name)
    
}

function GameLogic(computerChoice, playerChoice){
    computer_choice_container.style.backgroundImage = 'none'
    let winner = ''
    
    switch(playerChoice){
        case 'Rock':
            if(computerChoice == 'paper')    winner = 'ordinateur';
            if(computerChoice == 'scissors') winner = 'joueur';
            if(computerChoice == 'rock')     winner = 'egal';
            SetupComputerImgChoice(computerChoice)
            break;
        case 'paper':
            if(computerChoice == 'paper')    winner = 'egal';
            if(computerChoice == 'scissors') winner = 'ordinateur';
            if(computerChoice == 'rock')     winner = 'joueur';
            console.log('paper');
            SetupComputerImgChoice(computerChoice)
            break;
        case 'victory':
            if(computerChoice == 'paper')    winner = 'joueur';
            if(computerChoice == 'scissors') winner = 'egal';
            if(computerChoice == 'rock')     winner = 'ordinateur';
            SetupComputerImgChoice(computerChoice)
            break
        case 'start':
            status_label.innerHTML = 'Attente du choix du joueur'
            break;
    }

    if(winner != ''){
        gameStarted = false
        setLabels(winner)
    }
}

function SetupComputerImgChoice(computerChoice){
    if(computerChoice == 'rock')
        computer_choice_container.style.backgroundImage = 'url(' + rock_img + ')'
    else if(computerChoice == 'paper')
        computer_choice_container.style.backgroundImage = 'url(' + paper_img + ')'
    else if(computerChoice == 'scissors')
        computer_choice_container.style.backgroundImage = 'url(' + scisor_img + ')'    
}

function setLabels(winner){
    if(winner == 'egal'){
        status_label.innerHTML = 'Vous êtes à egalité !'
    }else{
        status_label.innerHTML = 'Le gagnant ' + winner
    }

    if(winner == 'joueur'){
        player_score += 1
        label_scoreP.innerHTML = player_score
    }
    else if(winner == 'ordinateur') {
        computer_score += 1
        label_scoreC.innerHTML = computer_score
    }
}

function resetScore(){
    player_score = 0
    computer_score = 0
    label_scoreP.innerHTML = player_score
    label_scoreC.innerHTML = computer_score
}