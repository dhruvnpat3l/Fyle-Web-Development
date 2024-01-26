// components/profile/profile.js

// Assuming 'user' is the object containing user information fetched from the API
function displayUserProfile(user) {
    // Update the HTML elements with user information
    document.getElementById('avatarImage').src = user.avatar_url;
    document.getElementById('userName').textContent = user.name || user.login;
    document.getElementById('userBio').textContent = user.bio || 'No bio available';
    document.getElementById('userLocation').textContent = 'Location: ' + (user.location || 'Not specified');
    document.getElementById('userEmail').textContent = 'Email: ' + (user.email || 'Not specified');
    document.getElementById('userFollowers').textContent = 'Followers: ' + user.followers;
    document.getElementById('userFollowing').textContent = 'Following: ' + user.following;
  }
  
  // Example usage:
  // Assuming 'user' is the object containing user information fetched from the API
  // Call the displayUserProfile function passing the user object

  
export {displayUserProfile};