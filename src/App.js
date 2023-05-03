import React, { useRef } from 'react';
import './App.css';
import Webcam from 'react-webcam'
import axios from 'axios'

function App() {
  const webcamRef = useRef(null)

  const videoConstraints = {
    facingMode: { exact: "environment" }
  };

  const setBtnHeight = () => {
    var camHeight = document.getElementById('webcam-comp').clientHeight
    var winHeight = window.innerHeight
    document.getElementById('scr-btn').style.height = (winHeight - camHeight) + 'px'
    document.getElementById('link-btn').style.height = (winHeight - camHeight) + 'px'
  }

  const takeScr = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    document.getElementById("img-box").src = imageSrc;
    document.getElementById("img-box").style.display = 'block';
    sendImage(imageSrc);
  }

  const sendImage = (imgData) => {
    axios.post('https://cors-anywhere.herokuapp.com/https://nonstopclass.com/cgi-bin/p3dModelSearch.cgi', {
      image: imgData
    })
      .then(function (response) {
        makeIframe(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const makeIframe = (data) => {
    if (data['msg'][0] === 's') {
      let bBox = data.BoundingPoly.NormalizedVertices;
      let iFrameSrc = data.url;
      let tempRes = iFrameSrc.split("/")

      document.getElementById("iframe-box").src = "https://p3d.in/e/" + tempRes[3] + "+bg-none+controls,border-hidden";
      document.getElementById("iframe-box").style.display = 'block';

      document.getElementById("b-box").style.top = ((bBox[1]['y']) * 100) + '%';
      document.getElementById("b-box").style.left = ((bBox[0]['x']) * 100) + '%';
      document.getElementById("b-box").style.height = ((bBox[3]['y'] - bBox[0]['y']) * 100) + '%';
      document.getElementById("b-box").style.width = ((bBox[1]['x'] - bBox[0]['x']) * 100) + '%';
      document.getElementById("b-box").style.display = 'block';
      document.getElementById("link-tag").href = iFrameSrc;

      var scrBtn = document.getElementById("scr-btn");
      scrBtn.classList.add("hidden");
      scrBtn.classList.remove("flex");

      var linkBtn = document.getElementById("link-btn");
      linkBtn.classList.remove("hidden");
      linkBtn.classList.add("flex");
    } else {
      alert("Invalid screenshot, Please try again.")

      var bBox = document.getElementById("b-box");
      bBox.classList.add("hidden");
      bBox.classList.remove("flex");

      var imgBox = document.getElementById("img-box");
      imgBox.classList.add("hidden");
      imgBox.classList.remove("flex");

      var iframeBox = document.getElementById("iframe-box");
      iframeBox.classList.add("hidden");
      iframeBox.classList.remove("flex");
    }
  }
  return (
    <div className="w-full">
      <div className="w-full overflow-hidden relative">
        <Webcam id="webcam-comp" ref={webcamRef} screenshotFormat="image/jpeg" className="w-full z-0" onCanPlay={setBtnHeight} videoConstraints={videoConstraints} />
        <img id="img-box" src="" className="hidden absolute top-0 left-0 w-full z-10" />
        <div id="b-box" className="b-box absolute bg-none hidden z-20"></div>
        <iframe allowFullScreen rameborder="0" id="iframe-box" className="z-30 hidden w-full h-full absolute top-0 left-0 border-none" seamless src=""></iframe>
      </div>
      <div onClick={takeScr} id="scr-btn" className="main-btn flex">Take a screenshot</div>
      <div id="link-btn" className="main-btn hidden"><a id="link-tag" href="" className="decoration-none text-white display-block">Go to model page</a></div>
    </div>
  );
}

export default App;
