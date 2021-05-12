var learnFile;
var detectionFile;
var choise;
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
            thumbnailElement.style.backgroundImage = "url(../web_ui/img/csv.jpg)";
        } else {
            thumbnailElement.dataset.label = "unsupported file type";
            thumbnailElement.style.backgroundImage = "url(../web_ui/img/x.png)";
        }
    };
}

function validityCheck() {
    window.alert("hello!");

    if (learnFile!=undefined && learnFile.name.endsWith(".csv") &&
        detectionFile!=undefined && detectionFile.name.endsWith(".csv"))
        {
            window.alert("valid files");
            return true;
        }
    window.alert("invalid file");
    return false;
}



