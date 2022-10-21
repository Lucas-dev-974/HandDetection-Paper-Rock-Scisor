import { Finger, FingerCurl, GestureDescription } from 'fingerpose'

// describe victory gesture ✌️
const Rock = new GestureDescription('Rock');


// thumb:
Rock.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
Rock.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
// index:
Rock.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
Rock.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
// middle:
Rock.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
Rock.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
// ring:
Rock.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
Rock.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
// pinky:
Rock.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
Rock.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);
export default Rock;