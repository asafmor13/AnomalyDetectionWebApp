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

function validityCheck(file1, file2) {
    if (file1!=undefined && file1.name.endsWith(".csv") &&
        file2!=undefined && file2.name.endsWith(".csv"))
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

function countRes(file) {
    let count=0;
    let i=0;
    var a=[];
    while(file[i] !== undefined) {
        if (!(a.includes(file[i].description))) {
            a.push(file[i].description);
            count++;
        }
        i++;
    }
    return count;
}

function createArr(size) {
    var x = new Array(size);
    for (var i = 0; i < size; i++) {
        x[i] = [];
    }
    return x;
}

function jasonToArr(file){
    var size = countRes(file);
    var arr=createArr(size);
    var j=0
    var i = -1;
    while (file[j]) {
        //window.alert("description = " + file[j].description);
        if ((i !== -1) && (file[j].description === (arr[i])[0])) {
            //window.alert("ts = " + file[j].timeStep);
            arr[i].push(file[j].timeStep);
        } else { // if its a new description to add
            i++;
            arr[i].push(file[j].description);
            arr[i].push(file[j].timeStep);
        }
        j++;
    }
    return arr;
}

function addButton(arr,i) {
    var d= i+1;
    var list_tag = document.getElementById('list');
    var li_tag = document.createElement('li');
    li_tag.id = "tab1";
    var a = document.createElement('a');
    a.href = '#tab'+d;
    a.innerText = arr[0];
    a.id="a_"+d;
    list_tag.appendChild(li_tag);
    li_tag.appendChild(a);
    var expStr="";
    for (var j=1;j<arr.length;j++){
        expStr=expStr.concat(arr[j]);
        expStr=expStr.concat(",");
    }
    let newDiv = document.createElement('div');
    newDiv.id="tab"+d;
    let img= document.createElement('img');
    img.src="./img/anomalyGraph.jpg"
    img.id="img"+d;
    let newP = document.createElement('p');
    newP.id="resTs"+d;
    newP.innerHTML=expStr.slice(0,-1);
    document.getElementById("first-tab-group").appendChild(newDiv);
    newDiv.appendChild(img);
    newDiv.appendChild(newP);
}

function setUpJs(){
    $('.tabgroup > div').hide();
    $('.tabgroup > div:first-of-type').show();
    $('.tabs a').click(function(e){
        e.preventDefault();
        var $this = $(this),
            tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
            others = $this.closest('li').siblings().children('a'),
            target = $this.attr('href');
        others.removeClass('active');
        $this.addClass('active');
        $(tabgroup).children('div').hide();
        $(target).show();
    })
}

function delLastButtons() {
    var listElement = document.getElementById('list');
    var element=list.childNodes[0];
    while (list.childNodes[0]) {
        listElement.removeChild(list.childNodes[0]);
    }
}

function setUpResView() {
    window.scroll(0, 1200);
    var jason = JSON.parse(Data);
    var arr=jasonToArr(jason);
    delLastButtons();
    for(var i = 0; i < arr.length ; i++){
        addButton(arr[i], i);
    }
    setUpJs();
}


$(document).ready(function(){
    $("form#Form").on('submit', function(e){
        e.preventDefault();
        var formData = new FormData();
        var model = document.getElementById("learn").files[0];
        var anomaly = document.getElementById("detect").files[0];
        if ((!(validityCheck(model,anomaly)))) {
            window.alert("one of the files(or more) are invalid, please resubmit");
            return false;
        }
        let action = setAction();


        formData.append("model", model);
        formData.append("anomaly", anomaly);
        $.ajax({
            type: 'POST',
            url: action,
            data: formData,  //JSON.stringify({"model":model, "anoamly":anomaly}),
            success: function(data) { console.log("success");
                console.log(data); Data = data ; setUpResView() },
            error: function(e) { console.log(e);
            },
            contentType: false,
            processData: false,
        })
    });
});