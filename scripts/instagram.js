FB.init({
  appId      : '443237566917005',
  cookie     : true,                     // Enable cookies to allow the server to access the session.
  xfbml      : true,                     // Parse social plugins on this webpage.
  version    : 'v9.0'           // Use this Graph API version for this call.
});

function getInstagramLoginStatus(callback) {
  FB.getLoginStatus(callback(response));
}

function connectToInstagram() {
  FB.login(function(response) {
    if (response.authResponse) {
      // we can retrieve the access token here
      instagramAuthorizedSuccessCallback();
    } else {
      instagramNotAuthorizedFailureCallback();
    }
  }, {"scope": "instagram_basic,instagram_content_publish"});
}

function postMediaToInstagram(payload) {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      user_id = response.authResponse.userID;
      user_access_token = response.authResponse.accessToken;
      postToInstagramCallback(user_id, user_access_token, payload, postMediaToInstagramCallback);
    } else {
      instagramNotAuthorizedFailureCallback();
    } 
  });
}

function postToInstagramCallback(user_id, user_access_token, payload, postingCallback) {
  instagramPostInProgressCallback();

  FB.api(
    '/' + user_id + '/accounts',
    'GET',
    {
      "fields": "name,access_token,instagram_business_account",
      "access_token": user_access_token
    },
    function(response) {
      if (!response || response.error) {
        instagramNoBusinessAccountFailureCallback();
      } else {
        if (response.data.length != 1) {
          instagramNoBusinessAccountFailureCallback();
        }
        instagram_id = response.data[0].instagram_business_account.id
        postingCallback(
          payload = payload,
          instagram_id = instagram_id,
          access_token = user_access_token
        );
      }
    }
  );
}

function postMediaToInstagramCallback(payload, instagram_id, access_token) { 

  let extension = payload['file_url'].split('.').pop();
  if (extension === 'mp4' || extension === 'mov') {
    FB.api(
      '/' + instagram_id + '/media',
      'POST',
      {
        "media_type": "VIDEO",
        "video_url": payload['file_url'],
        "caption": payload['description'],
        "access_token": access_token,
      },
      function(response) {
        monitorContainerUploadStatus(response.id, payload, instagram_id, access_token)
      }
    );
  } else if (extension === 'jpg' || extension === 'jpeg') {
    FB.api(
      '/' + instagram_id + '/media',
      'POST',
      {
        "image_url": payload['file_url'],
        "caption": payload['description'],
        "access_token": access_token,
      },
      function(response) {
        monitorContainerUploadStatus(response.id, payload, instagram_id, access_token)
      }
    );
  } else {
    instagramUnsupportedFormatFailureCallback();
  }
}

function monitorContainerUploadStatus(container_id, payload, instagram_id, access_token) {
  FB.api(
    '/' + container_id,
    'GET',
    {
      "fields": "status_code"
    },
    function(response) {
      if (response.status_code == 'FINISHED') {
        instagramUploadContainer(container_id, access_token)
      } else if (response.status_code == 'IN_PROGRESS') {
        // preparing, try again in a bit
        setTimeout(function () {
          monitorContainerUploadStatus(container_id, payload, instagram_id, access_token);
        }, 5000);
      } else {
        instagramPostFailureCallback();
      }
    }
  );
}

function instagramUploadContainer(container_id, access_token) {
  FB.api(
    '/' + instagram_id + '/media_publish',
    'POST',
    {
      'creation_id': container_id,
      'access_token': access_token
    },
    function(response) {
      if (!response || response.error) {
        instagramPostFailureCallback();
      } else {
        instagramPostSuccessCallback();
      }
    }
  );
}

function instagramPostSuccessCallback() {
  document.getElementById("instagram_status").innerHTML = "Post successful!";
}

function instagramPostInProgressCallback() {
  document.getElementById("instagram_status").innerHTML = "Posting...";
}

function instagramPostSuccessCallback() {
  document.getElementById("instagram_status").innerHTML = "Post successful!";
}

function instagramAuthorizedSuccessCallback() {
  document.getElementById("instagram_status").innerHTML = "Authorization successful!";
}

function instagramNotAuthorizedFailureCallback() {
  document.getElementById('instagram_status').innerHTML = 'Please authorize Instagram before posting.';
}

function instagramNoBusinessAccountFailureCallback() {
  document.getElementById('instagram_status').innerHTML = 'Cannot retrieve Instagram business account. Please logging in again.';
}

function instagramPostFailureCallback() {
  document.getElementById('instagram_status').innerHTML = 'Post failed.';
}

function instagramUnsupportedFormatFailureCallback() {
  document.getElementById('instagram_status').innerHTML = 'Post failed. Unsupported file format.';
}
