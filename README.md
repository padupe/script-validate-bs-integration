<p align="center">
  <h1 align="center">script-validate-bs-integration</h1></p>
<p align="center"><img src="./docs/assets/code-icon.png" width="80">
<p align="center">
  <a href="https://backstage.io/" target="_blank"><img src="https://backstage.io/logo_assets/svg/Logo_Teal.svg" alt="Flux" width="200"/></a>
</p>

## Index

- [Description](#description)
- [Flow](#flow)
- [Requirements](#requirements)
  - [General](#general)
  - [Secrets](#secrets)
- [How to use?](#how-to-use)
- [Contribute](#contribute)

---

## Description

Script that validates if the organization's repositories have the integration file with [Backstage](https://backstage.io/).

---

## Requirements

### General

- [Node.js](https://nodejs.org/en/) v16 || v18;
- [Yarn](https://yarnpkg.com/).

### Secrets

| What? | Data Type | Description |
| :--: | :--: | :-- |
| `GITHUB_TOKEN` |  String | Token with read permissions to organization repositories for interaction via GitHub API. |
| `ORG_GITHUB` | String | Organization name on GitHub. |
| `BRANCH_DEFAULT_NAME` | String | Primary (or default) branch name. |
| `INTEGRATION_FILE` | String | Integration file name (usually `catalog-info.yaml`) |

---

## How to use?

1 - Clone the project.
>SSH
```bash
git clone git@github.com:padupe/script-validate-bs-integration.git
```

>HTTPS
```bash
git clone https://github.com/padupe/script-validate-bs-integration.git
```

2 - Access the project directory.

3 - Create the `.env` file according to the `example.env` template and enter the required values.

4 - Install the dependencies.
```bash
yarn install
```

5 - Run the command:
```bash
node src/index.js
```
---

## Contribute

Check our [CONTRIBUTING](./CONTRIBUTING.md) guidelines.
