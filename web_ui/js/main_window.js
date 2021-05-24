var learnFile;
var detectionFile;
var Data;
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            file = e.dataTransfer.files[0];
            updateThumbnail(dropZoneElement, file);
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });

    detect.addEventListener("change", event => {
        const files = event.target.files;
        //uploadFile(files);
    });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */

function updateThumbnail(dropZoneElement, file) {
    if (dropZoneElement.id == "learnFile") {
        learnFile = file;
    } else {
        detectionFile = file;
    }
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    thumbnailElement.style.width="200px";
    thumbnailElement.style.height="250px";

    reader.onload = () => {
        if (file.name.endsWith(".csv")) {
            thumbnailElement.dataset.label = file.name;
            thumbnailElement.style.backgroundImage = "url(/img/csv.jpg)";
        } else {
            thumbnailElement.dataset.label = "unsupported file type";
            thumbnailElement.style.backgroundImage = "url(/img/x.png)";
        }
    };
}

function setForm() {
    // setFiles();
    // let action = setAction();

    window.alert("set form :)");
    if (true || validityCheck()) {
        // do the actual query...

        $.ajax({
            type: 'post',
            url: '/ajax',
            data: formData,
            dataType: 'text'
        })
            .done(function(data){
                window.alert(data.data);
            });
    }

    return false;
}

function setFiles() {

    document.getElementById("learn").input=learnFile;
    document.getElementById("detect").input=detectionFile;
}

function validityCheck() {
    if (learnFile!=undefined && learnFile.name.endsWith(".csv") &&
        detectionFile!=undefined && detectionFile.name.endsWith(".csv"))
        {
            return true;
        }
    return false;
}

function setAction() {
    let choice=document.getElementById("detectors").value;
    let action="/api/detect?model_type=" + choice;
    // document.getElementById("Form").action=action
    return action
}
 function nextComma(string){
    window.alert("here");
    let size = string.length;
    let firstTime = 0;
    let i = 0;
    for (; i < size ; i++) {
        if (string[i] == ',') {
            if (firstTime === 1) {
                return i;
            } else {
                firstTime = 1;
            }
        }
    }
    return -1;
}

function setUpResView() {
    //window.scroll(0, 1200);

    var map = new Map();
    var endIndex =nextComma(Data);
    var startIndex = 1;
    while (endIndex != -1) {
        var curr = Data.slice(startIndex,endIndex);
        window.alert(curr);
        var jason = JSON.parse(curr);
        map.set(jason.description, jason.timeStep);
        startIndex = endIndex + 1;
        endIndex =nextComma(Data.slice(endIndex,0));
    }
    curr = Data.slice(startIndex,endIndex);
    window.alert(curr);
    jason = JSON.parse(curr);
    map.set(jason.description, jason.timeStep);

    const iterator1 = map.values();
    window.alert(iterator1.next().value);
    window.alert(iterator1.next().value);

}

$(document).ready(function(){
    $("form#Form").on('submit', function(e){
        e.preventDefault();
        var formData = new FormData();
        var model = document.getElementById("learn").files[0];
        var anomaly = document.getElementById("detect").files[0];
        formData.append("model", model);
        formData.append("anomaly", anomaly);
        $.ajax({
            type: 'POST',
            url: "/api/detect?model_type=regression",
            data: formData,  //JSON.stringify({"model":model, "anoamly":anomaly}),
            success: function(data) { console.log("success");
                console.log(data); Data = data; setUpResView() },
            error: function(e) { console.log(e); },
            contentType: false,
            processData: false,
        })
    });
});