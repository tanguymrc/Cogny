let video = document.getElementById("video"); // video element
let model; // blazeface model
let canvas = document.getElementById("canvas"); // canvas element
let ctx = canvas.getContext("2d"); // canvas context

const setupCamera = () => { // setup camera function
    navigator.mediaDevices.getUserMedia({ // get user media
        video: { width: 600, height: 400 }, // video width and height
        audio: false, // no audio
    }).then(stream => { // if success
        video.srcObject = stream; // set video source
    });
};

const detecteFaces = async () => { // detect faces function
    const prediction = await model.estimateFaces(video, false); // predict faces from video

    // console.log(prediction); // log prediction

    ctx.drawImage(video, 0, 0, 600, 400); // draw video on canvas

    prediction.forEach((pred) => { // for each prediction
        ctx.beginPath(); // begin path
        ctx.lineWidth = "4"; // line width
        ctx.strokeStyle = "blue"; // stroke style
        ctx.rect( // draw rectangle
            pred.topLeft[0] - 50, // top left x
            pred.topLeft[1] - 50, // top left y
            pred.bottomRight[0] - pred.topLeft[0] + 50, // width
            pred.bottomRight[1] - pred.topLeft[1] + 50, // height
        );
        ctx.stroke(); // stroke path

        ctx.fillStyle = "red"; // fill style
        pred.landmarks.forEach((landmark) => { // for each landmark in prediction
            ctx.fillRect(landmark[0], landmark[1], 5, 5); // draw rectangle
        });
    });
}

setupCamera(); // setup camera

video.addEventListener("loadeddata", async () => { // when video is loaded
    model = await blazeface.load(); // load blazeface model
    setInterval(detecteFaces, 40); // detect faces every 40ms
});
