const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const Browse = document.querySelector(".Browse")

const host= "https://neha-khan-file-share.herokuapp.com/"
const uploadURL = `${host}api/files`;
dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
  
})
dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragged")
})

dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged")
    const files = e.dataTransfer.files
    // console.log(files);
    // console.log(e.dataTransfer.files.length);
    //checking if user dropped any file or not
    if(files.length){
        fileInput.files=files;
        uploadFile()
    }
})
//upload File
const uploadFile=()=>{
    const file = fileInput.files[0]

    const formData= new FormData()
    formData.append("myfile",file)
    console.log(formData)
    const xhr = new XMLHttpRequest();
    //xhr configuration
    xhr.onreadystatechange=()=>{
        // console.log(xhr.readyState)
        if(xhr.readystate===XMLHttpRequest.DONE){
            console.log(xhr.response);
        }
    };
    xhr.open("POST",uploadURL);
    xhr.send(formData)
}
fileInput.addEventListener("change",()=>{
    uploadFile()
})
Browse.addEventListener("click",()=>{
    fileInput.click()
})

//whenver client do request to live server
//modern browser blocked this kind of request for the security purpose
//for this problem we can use proxy like in react angular but here in this project we will be handling at server side
//at server we will set up cors middleware
//before main request pre request is send in which we have to add cors headers so browser check whether we forward main request or not if received header then second request successfully sent

