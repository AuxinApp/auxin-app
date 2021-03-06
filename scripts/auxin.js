function loadUserFileList() {
    let request = new XMLHttpRequest();
    request.open('GET', './listUserContent');
    request.responseType = 'text';
    request.onload = function() {
        var select = document.getElementById('sel');
        var L = select.options.length - 1;
        for(var i = L; i >= 0; i--) {
            select.remove(i);
        }
        
        files = JSON.parse(request.response)['files'];

        for (var i = 0; i < files.length; i++) {
            var option = document.createElement("option");
            option.text = files[i];
            option.value = files[i];
            document.getElementById('sel').appendChild(option);
        }

        loadPromotionDetail();
    };
    request.send();
}

function loadPromotionDetail() {
    selection_element = document.getElementById('sel');
    selected_name = selection_element.options[selection_element.selectedIndex].value;

    let request = new XMLHttpRequest();
    request.open('GET', './getContent/user_assets/' + selected_name + '.json');
    request.responseType = 'text';
    request.onload = function() {
        
        title = JSON.parse(request.response)['title'];
        message = JSON.parse(request.response)['message'];

        title_element = document.getElementById('selected_title');
        description_element = document.getElementById('selected_description');

        title_element.innerHTML = "Title: " + title;
        description_element.innerHTML = "Message: " + message;
    };
    request.send();
}

function deploy(file_name, formData) {
    // selection_element = document.getElementById('sel');
    // selected_name = selection_element.options[selection_element.selectedIndex].value;
    selected_name = file_name;
    
    let request = new XMLHttpRequest();
    request.open('GET', './getContent/user_assets/' + selected_name + '.json');
    request.responseType = 'text';
    request.onload = function() {
        filename = JSON.parse(request.response)['file'];
        title = JSON.parse(request.response)['title'];
        message = JSON.parse(request.response)['message'];
        file_url = window.location.href + "getContent/user_assets/" + filename;
        payload = {
            'title': title,
            'description': message,
            'file_url': file_url,
        }
        if (document.getElementById("ig_post").checked) {
            postMediaToInstagram(payload);
        }
        if (document.getElementById("fb_post").checked) {
            postMediaToFacebook(payload);
        }
        if (document.getElementById("linkedin_post").checked) {
            postMediaToLinkedIn(formData);
        }
    };
    request.send();
}

function authLinkedin() {
    let request = new XMLHttpRequest();
    request.open('GET', './loginToLinkedInAsUser');
    request.responseType = 'text';
    request.send();
}

function submitForm() {
    var fileInput = document.getElementById('file');   
    var filename = fileInput.files[0].name;
    filename = filename.replace(/\.[^/.]+$/, "");
    var formData = new FormData(document.getElementById("fileUpload"));

    var request = new XMLHttpRequest();
    request.open("POST", "./uploadContent"); 
    request.onload = function(event) { 
        deploy(filename, formData);
    }; 
    request.onerror = function(event) {
        document.getElementById("instagram_status").innerHTML = "Post failed.";
        document.getElementById("facebook_status").innerHTML = "Post failed.";
        document.getElementById("linkedin_status").innerHTML = "Post failed.";
    }
    request.send(formData);
}
