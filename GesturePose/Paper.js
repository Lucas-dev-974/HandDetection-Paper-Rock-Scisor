import { Finger, FingerCurl, GestureDescription } from 'fingerpose'

// describe victory gesture ✌️
const Paper = new GestureDescription('paper');


// thumb:
Paper.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);


// index:
Paper.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

// middle:
Paper.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// ring:
Paper.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);

// pinky:
Paper.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

export default Paper;