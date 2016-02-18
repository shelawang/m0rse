var DEBUG = true;
var DEFAULT = "DEFAULT";

var _myFirebaseRef = new Firebase("https://m0rse.firebaseio.com/");
var _channelRef = _myFirebaseRef.child("DEFAULT");
var _channelNeedsUpdate = false;
var _audioContext = new AudioContext;
var _oscillator = _audioContext.createOscillator();

_oscillator.frequency.value = 600; //Hz - should be 600-800 acc to ham.stackexchange
_oscillator.connect(_audioContext.destination);
_oscillator.disconnect();
_oscillator.start();


function d(functionName, text) {
    if (DEBUG) {
        console.log(functionName + ": " + text);
    }
}

function onLoad() {
    updateIndicator(false);
    updateChannelWithName(DEFAULT);
}

function buttonClicked() {
    d("buttonClicked", "");
    if (_channelNeedsUpdate) { updateChannelWithNameOnForm(); }
    setChannelWithState(true);
}

function buttonReleased() {
    d("buttonReleased", "");
    setChannelWithState(false);
}

/**
 * @param state True if channel is "ON"; false if channel is "OFF"
 */
function setChannelWithState(state) {
    _channelRef.update({ state : state });
}

function channelChanged() {
    _channelNeedsUpdate = true;
}

function getValueOfElementFromForm(element, form) {
    var form = document.getElementById(form);
    var val = form.elements[element].value;
    return val;
}

/**
 * @return The text that is in the input box on this page
 */
function getChannelNameFromForm() {
    var val = getValueOfElementFromForm("channelName", "channelForm");
    if (val == null || val == "") { val = DEFAULT; }
    return val;
}

function updateChannelWithName(newName) {
    _channelRef.off(); //detach callbacks

    _channelRef = _myFirebaseRef.child(newName);
    attachChannelListener(_channelRef);

    d("updateChannelWithName", newName);

    _channelNeedsUpdate = false;
}

function updateChannelWithNameOnForm() {
    updateChannelWithName(getChannelNameFromForm());
}

function attachChannelListener(ref) {
    // Attach an asynchronous callback to read the data at the given reference
    ref.child("state").on("value", function(snapshot) {
        var state = snapshot.val();
        d("attachChannelListenerCallback", state);

        updateIndicator(state);

        if (state) playSound();
        else stopSound();
    });
}

function submitTranslateForm() {
    var val = getValueOfElementFromForm("textToTranslate", "translateForm");
    document.getElementById("translation").innerHTML = translateStringToMorseCode(val);
}

/**
 * @param state True if channel is "ON"; false if channel is "OFF"
 */
function updateIndicator(state) {
    document.getElementById("channelStatus").style.background = (state ? "red" :  "black");
}

function playSound() {
    _oscillator.connect(_audioContext.destination);
}

function stopSound() {
    try {
        _oscillator.disconnect(_audioContext.destination);
    } catch (error) {
        if (DEBUG) d(error.message);
    }
}

/*
TODO

Morse code to text diagram
about/help
option to use space bar on desktops
investigate making the sound on mobile
shelawang.me/m0rse/channelname links to channelname
ribbon to show entered characters
finish CSS

*/
