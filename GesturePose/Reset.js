import { Finger, FingerCurl, GestureDescription } from 'fingerpose'

// describe victory gesture ✌️
const Reset = new GestureDescription('reset');


// thumb:
Reset.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
Reset.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
// index:
Reset.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
// middle:
Reset.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
// ring:
Reset.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
// pinky:
Reset.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

export default Reset;