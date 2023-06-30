require('dotenv').config()
const { Octokit } = require('octokit')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

// Octokit instance for interactions via GitHub API
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

/**
 * Function responsible for "capturing" and listing all Organization repositories on GitHub
 *
 * @param {*} organization [String] Organization name on GitHub
 * @param {*} pageNumber [Number] Page number (from list) of Organization repositories on GitHub
 * @returns [Array] List of repositories per page
 */
async function getAllRepositories(organization, pageNumber) {
    const repositories = await octokit.request('GET /orgs/{org}/repos', {
        org: organization,
        per_page: 100,
        page: pageNumber,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    if(!repositories) {
        return console.error(`There are no repositories on the page ${pageNumber}.`)
    }

    const repositoryName = repositories.data.map(repo => repo.name)

    return repositoryName
}

/**
 * Function responsible for scanning all pages of the Organization repository listing on GitHub
 *
 * @param {*} organization [String] Organization name on GitHub
 * @returns [Array] List of Organization repositories
 */
async function getAllRepositoriesLoop(organization) {
    const allRepositories = []
    let pageNumber = 1
    let repositories = await getAllRepositories(organization, pageNumber)

    while(repositories && repositories.length > 0) {
        allRepositories.push(...repositories)
        pageNumber++
        repositories = await getAllRepositories(organization, pageNumber)
    }

    return allRepositories
}

/**
 * Function responsible for validating if the integration file exists in the repository
 *
 * @param {*} owner [String] Organization name on GitHub
 * @param {*} repo [String] Repository name
 * @param {*} branch [String] Primary (or default) branch name
 * @param {*} filePath [String] Integration file name
 * @param {*} resultList [Array] List of repositories that contain the integration file
 * @param {*} failureList [Array] List of repositories that DO NOT contain the integration file
 */
async function validateFileExists(owner, repo, branch, filePath, resultList, failureList) {
    try {
        const validate = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path: filePath,
            ref: branch,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        if (validate.status === 200) {
            resultList.push(repo);
        }
    } catch (error) {
        if (error.status === 404) {
            failureList.push(repo);
        } else {
            console.error(error);
        }
    }
}

async function main() {
    const owner = process.env.ORG_GITHUB;
    const branch = process.env.BRANCH_DEFAULT_NAME;
    const filePath = process.env.INTEGRATION_FILE
    // Returns all repositories in the organization
    const repositories = await getAllRepositoriesLoop(owner);
    const resultList = [];
    const failureList = []

    // Performs requests to validate if the integration file exists
    for (const repo of repositories) {
        await validateFileExists(owner, repo, branch, filePath, resultList, failureList)
    }

    // Remove duplicates from lists
    const uniqueFailureList = [...new Set(failureList)];
    const uniqueResultList = [...new Set(resultList)];

    // Defines the path and name of .csv files
    const failureListFilePath = 'failureList.csv';
    const resultListFilePath = 'resultList.csv';

    // Create CsvWriter objects for each file
    const failureListCsvWriter = createCsvWriter({
        path: failureListFilePath,
        header: [
            { id: 'repository', title: 'Repository' }
        ]
    });

    const resultListCsvWriter = createCsvWriter({
        path: resultListFilePath,
        header: [
            { id: 'repository', title: 'Repository' }
        ]
    });

    // Write the data in the respective lists
    await failureListCsvWriter.writeRecords(uniqueFailureList.map(repo => ({ repository: repo })));
    await resultListCsvWriter.writeRecords(uniqueResultList.map(repo => ({ repository: repo })));

    console.log('CSV files successfully generated.');
}

main()

module.exports={
    octokit,
    createCsvWriter,
    getAllRepositories,
    getAllRepositoriesLoop,
    main,
    validateFileExists,
}
