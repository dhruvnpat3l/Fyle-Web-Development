// script.js
import { displayUserProfile } from "/component/profile/profile.js";
// Create an instance of Apiservice
import Apiservice from '/services/apiService.js'
const apiService = new Apiservice();
  
// Variables for pagination
let currentPage = 1;
let repositoriesPerPage = 10; // Default number of repositories per page
let totalRepositories = 0;

// Function to display loader
function showLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    if (loader) {
        loader.style.display = 'flex'; // Flex display to center the loader
    }
}

function hideLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    if (loader) {
        loader.style.display = 'none';
    }
}

// Function to display repository list
export function displayRepositoryList(repositories) {
    showLoader('repositoryListLoader');
      
    // Placeholder for loading the repository list component
    fetch('./component/repositorylist/repositorylist.html')
        .then(response => response.text())
        .then(data => {
            
            document.getElementById('repositoryListContainer').innerHTML = '';

            // Update repository list with actual data
            repositories.forEach(repo => {
                const repoItem = document.createElement('div');
                repoItem.innerHTML = data;
                

                // Update the HTML elements with repository information
                repoItem.querySelector('#repoName').textContent = repo.name;
                repoItem.querySelector('#repoDescription').textContent = repo.description || 'No description available';
                repoItem.querySelector('#repoLanguage').textContent = repo.language || 'Not specified';
                repoItem.querySelector('#repoUrl').innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.html_url}</a>`;

                // Display topics
                const topicsElement = repoItem.querySelector('#repoTopics');
                repo.topics.forEach(topic => {
                    const topicBox = document.createElement('span');
                    topicBox.textContent = topic;
                    topicBox.classList.add('topic-box');
                    topicsElement.appendChild(topicBox);
                });

                document.getElementById('repositoryListContainer').appendChild(repoItem);
            });

            // Add pagination controls
            initializePagination();
            // Add Repo Per Page controls
            initializeRepoPerPage();

            hideLoader('repositoryListLoader');
        })
        .catch(error => {
            console.error('Error loading repository list component:', error);
            hideLoader('repositoryListLoader');
        });
} 


// Function to fetch repositories based on page number
async function fetchRepositories(username, page, perPage) {
    try {
        // Display loader while fetching repositories
        showLoader('repositoryListLoader');
        

        // Fetch user data including the total number of repositories
        const userData = await apiService.getUser(username);

        // Extract the total number of repositories from user data
        totalRepositories = userData.public_repos;

        // Fetch repository list using the Apiservice
        const repositories = await apiService.getUserRepo(username, page, perPage);
        
       
        // Load Repository List Component
        displayRepositoryList(repositories);

        // Update pagination controls with the total number of repositories
    } catch (error) {
        console.error('Error fetching repositories:', error);
        hideLoader('repositoryListLoader');
    }
}

// Fetch user data and repository list when the Fetch Repositories button is clicked
document.getElementById('fetchButton').addEventListener('click', async function () {
    displayData();
});

// Event listener for "Enter" key
document.getElementById('usernameInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        displayData();
    }
});

async function displayData() {
    try {
        // Get the GitHub username from the input box
        const githubUsername = document.getElementById('usernameInput').value;

        showLoader('userDataLoader'); // Show loader while fetching user data

        // Fetch user data using the Apiservice
        const user = await apiService.getUser(githubUsername);

        // Load Profile Component
        fetch('./component/profile/profile.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('profileContainer').innerHTML = data;
                // Call the displayUserProfile function passing the user object
                displayUserProfile(user);
            })
            .catch(error => {
                console.error('Error loading profile component:', error);
            })
            .finally(() => {
                hideLoader('userDataLoader'); // Hide loader when user data is fetched
            });

        // Fetch and display the first page of repositories
        fetchRepositories(githubUsername, currentPage, repositoriesPerPage);
    } catch (error) {
        console.error('Error fetching user data:', error);
        hideLoader('userDataLoader'); // Hide loader in case of an error
    }
}

// Pagination controls
document.getElementById('prevPage').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        fetchRepositories(document.getElementById('usernameInput').value, currentPage, repositoriesPerPage);
    }
});

document.getElementById('nextPage').addEventListener('click', function () {
    currentPage++;
    fetchRepositories(document.getElementById('usernameInput').value, currentPage, repositoriesPerPage);
});

// Function to initialize and display Pagination controls
function initializePagination() {
    fetch('./component/pagination/pagination.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('paginationContainer').innerHTML = data;

            // Add event listener to "Previous" button
            document.getElementById('prevPage').addEventListener('click', function () {
                if (currentPage > 1) {
                    currentPage--;
                    fetchRepositories(document.getElementById('usernameInput').value, currentPage, repositoriesPerPage);
                }
            });

            // Display loader while fetching pagination
            showLoader('paginationLoader');

            // Check if there are repositories on the next page before adding event listener
            const nextPageButton = document.getElementById('nextPage');
            const prePageButton = document.getElementById('prevPage');
            const hasMoreRepositories = totalRepositories > currentPage * repositoriesPerPage;

            if (!(currentPage >1)){
                prePageButton.classList.add('disabled');
            }
 
            if (hasMoreRepositories) {
                nextPageButton.addEventListener('click', function () {
                    currentPage++;
                    fetchRepositories(document.getElementById('usernameInput').value, currentPage, repositoriesPerPage);
                });
            } else {
                nextPageButton.classList.add('disabled');
            }

            // Hide loader after fetching pagination
            hideLoader('paginationLoader');
        })
        .catch(error => {
            console.error('Error loading pagination component:', error);
            hideLoader('paginationLoader');
        });
}

// Function to initialize and display Repo Per Page controls
function initializeRepoPerPage() {
    fetch('./component/repositoryfilter/repositoryfilter.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('repoPerPageContainer').innerHTML = data;

            // Update repositories per page when button is clicked
            document.getElementById('perPage10').addEventListener('click', function () {
                repositoriesPerPage = 10;
                updatePerPageButtons('perPage10');
                fetchRepositories(document.getElementById('usernameInput').value, currentPage, repositoriesPerPage);
            });

            document.getElementById('perPage25').addEventListener('click', function () {
                repositoriesPerPage = 25;
                updatePerPageButtons('perPage25');
                fetchRepositories(document.getElementById('usernameInput').value, currentPage, repositoriesPerPage);
            });

            document.getElementById('perPage50').addEventListener('click', function () {
                repositoriesPerPage = 50;
                updatePerPageButtons('perPage50');
                fetchRepositories(document.getElementById('usernameInput').value, currentPage, repositoriesPerPage);
            });

            document.getElementById('perPage100').addEventListener('click', function () {
                repositoriesPerPage = 100;
                updatePerPageButtons('perPage100');
                fetchRepositories(document.getElementById('usernameInput').value, currentPage, repositoriesPerPage);
            });

            // Add Repo Per Page controls
            updatePerPageButtons(`perPage${repositoriesPerPage}`);
        })
        .catch(error => {
            console.error('Error loading repo per page component:', error);
        });
}

// Function to update the styling of repository per page buttons
function updatePerPageButtons(selectedButtonId) {
    const perPageButtons = document.querySelectorAll('.btn-per-page');
    perPageButtons.forEach(button => {
        if (button.id === selectedButtonId) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}
