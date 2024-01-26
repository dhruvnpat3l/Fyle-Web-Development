// services/ApiService.js

class Apiservice {
    constructor(){
        this.apiUrl = 'https://api.github.com/users';
    }

    async getUser(githubUsername) {
        const userUrl = `${this.apiUrl}/${githubUsername}`;

        try {
            const response = await fetch(userUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch user: ${response.status}`);
            }
           
            // Parse JSON response
            return await response.json();
        } catch(error) {
            console.error('Error Fetching user:', error.message);
            throw error;
        }
    }

  
        async getUserRepo(githubUsername,page,repoPerPage) {
            const repoUrl = `${this.apiUrl}/${githubUsername}/repos?page=${page}&per_page=${repoPerPage}`;

            try {
                const response = await fetch(repoUrl);

                if (!response.ok) {
                    throw new Error(`Failed to fetch user repositories: ${response.status}`);
                }

                // Parse JSON response
                return await response.json();
            } catch(error) {
                console.error('Error Fetching user repositories:', error.message);
                throw error;
            }
        }
    
}

export default Apiservice