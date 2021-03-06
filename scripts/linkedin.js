function postMediaToLinkedIn(formData) {
    var linkedin_request = new XMLHttpRequest();
    linkedin_request.open("POST", "./post-content-image");
    linkedInPostInProgressCallback();
    linkedin_request.onload = function(event) {
        linkedInPostSuccessCallback();
    }
    linkedin_request.onerror = function(event) {
        linkedInPostFailureCallback();
    }
    linkedin_request.send(formData)
}

function linkedInPostSuccessCallback() {
    document.getElementById("linkedin_status").innerHTML = "Post successful!";
}
  
function linkedInPostInProgressCallback() {
    document.getElementById("linkedin_status").innerHTML = "Posting...";
}
  
function linkedInPostFailureCallback() {
    document.getElementById('linkedin_status').innerHTML = 'Post failed.';
}

