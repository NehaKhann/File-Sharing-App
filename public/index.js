const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".Browse");
const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const fileURL = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");
const emailForm = document.querySelector(".emailForm");
const alert = document.querySelector(".alert");
const baseURL = "https://neha-khan-file-share.herokuapp.com";
const uploadURL = `${baseURL}/api/files`;
const emailURL = `${baseURL}/api/files/send`;

const allowedSize = 100 * 1024 * 1024; //100MB

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  //   console.log("dropped", e.dataTransfer.files[0].name);
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  // console.log(files);
  // console.log(e.dataTransfer.files.length);
  //checking if user dropped any file or not
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }

  // console.log("dropping file");
});

dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");

  console.log("drag ended");
});
fileInput.addEventListener("change", () => {
  uploadFile();
});
copyBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  showalert("Link Copied");
});
const uploadFile = () => {
  progressContainer.style.display = "block";
  if (fileInput.files.length > 1) {
    fileInput.value = "";
    showalert("Upload One File");
    return;
  }
  const file = fileInput.files[0];
  console.log("file uploading");
  if (file.size > allowedSize) {
    showalert("Can't Upload more than 100 MB File");
  }

  const formData = new FormData();
  formData.append("myfile", file);
  const xhr = new XMLHttpRequest();
  // listen for response which will give the link
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      console.log(xhr.response);
      showLink(JSON.parse(xhr.response));
    }
  };
  //showing the progress of uploading file
  xhr.upload.onprogress = function (e) {
    //   console.log(event);
    const loaded = e.loaded;
    const total = e.total;
    const percent = Math.round((loaded / total) * 100);
    console.log(percent);
    bgProgress.style.width = `${percent}%`;
    progressPercent.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`;
  };
  xhr.upload.onerror = () => {
    fileInput.value = "";
    showalert(`Error in uploading ${xhr.statusText}`);
  };
  xhr.open("POST", uploadURL);
  xhr.send(formData);
};
//calculating % for uploading
//10/25=0.4*100=40%

//we are getting file from the link by object destructuring
const showLink = ({ file: url }) => {
  console.log(url);
  fileInput.value = "";
  emailForm[2].removeAttribute("disable", "true");
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileURL.value = url;
};
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form submitted");
  const url = fileURL.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };
  console.log(formData);
  //send button
  emailForm[2].setAttribute("disable", "true");
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showalert("Email Successfully sent");
        sharingContainer.style.display = "none"; // hide the box
      }
    });
});
let alertTimer;
const showalert = (msg) => {
  alert.innerText = msg;
  alert.style.transform = `translate(-50%,0)`;
  clearTimeout(alertTimer);
  alertTimer = setTimeout(() => {
    alert.style.transform = `translate(-50%,60px)`;
  }, 3000);
};
