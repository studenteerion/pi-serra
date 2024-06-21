/* import './Cam.css'; */

function Cam({ index }) {
    return (
        <div>
            ciao
            <div className="stream">
                <img className="img" src='http://192.168.112.57:81/videostream.cgi?loginuse=admin&loginpas=' alt="video stream" width="1400"></img>
            </div>
        </div>
    );
}

export default Cam;