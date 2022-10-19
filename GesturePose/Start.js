import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose'

// describe victory gesture ✌️
const startDescription = new GestureDescription('start');


// thumb:
startDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
startDescription.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);

// index:
startDescription.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);

// middle:
startDescription.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// ring:
startDescription.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);

// pinky:
startDescription.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

export default startDescription;