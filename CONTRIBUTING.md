## 👨‍💻 Prerequisite Skills to Contribute

### Contribute in Components/CSS

-  [Typescript](https://www.typescriptlang.org/)
-  [TailwindCSS](https://tailwindcss.com/)

### Contribute in framework

### Contribute in framework

-  [Nextjs](<[https://graphql.org/](https://nextjs.org/docs)>)

### Contribute in state-management

-  [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)

---

## 💥 How to Contribute

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/JhohannesK/TipoHiZ/pulls)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/JhohannesK/)

-  Take a look at the existing [Issues](https://github.com/JhohannesK/TipoHiZ/issues) or [create a new issue](https://github.com/JhohannesK/TipoHiZ/issues/new/choose)!
-  [Fork the Repo](https://github.com/JhohannesK/TipoHiZ/fork). Then, create a branch for any issue that you are working on. Finally, commit your work.
-  Create a **[Pull Request](https://github.com/JhohannesK/TipoHiZ/compare)** (_PR_), which will be promptly reviewed and given suggestions for improvements by the community.
-  Add screenshots or screen captures to your Pull Request to help us understand the effects of the changes proposed in your PR.

---

## 🤓 HOW TO MAKE A PULL REQUEST:

**1.** Start by making a Fork of the [**TipoHiZ**](https://github.com/JhohannesK/TipoHiZ) repository. Click on the <a href="https://github.com/JhohannesK/TipoHiZ/fork"><img src="https://i.imgur.com/G4z1kEe.png" height="20" width="20"></a>Fork symbol at the top right corner.

**2.** Clone your new fork of the repository in the terminal/CLI on your computer with the following command:

```bash
git clone https://github.com/<your-github-username>/TipoiZ
```

**3.** Navigate to the newly created TipoHiZ project directory:

```bash
cd TipoHiZ
```

**4.** Set upstream command:

```bash
git remote add upstream https://github.com/JhohannesK/TipoHiZ.git
```

**5.** Create a new branch:

```bash
git checkout -b YourBranchName
```

**6.** Sync your fork or your local repository with the origin repository:

-  In your forked repository, click on "Fetch upstream"
-  Click "Fetch and merge"

### Alternatively, Git CLI way to Sync forked repository with origin repository:

```bash
git fetch upstream
```

```bash
git merge upstream/main
```

### [Github Docs](https://docs.github.com/en/github/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-on-github) for Syncing

**7.** Make your changes to the source code.

**8.** Stage your changes:

⚠️ **Make sure** not to commit `package.json` or `package-lock.json` file. If there is a need to commit them. You would need to seek permission in the discussions first before commiting them.

<!-- ⚠️ **Make sure** not to run the commands `git add .` or `git add *` -->

<!-- > Instead, stage your changes for each file/folder
>
> By using public path it means it will add all files and folders under that folder, it is better to be specific -->

```bash
git add .
```

_or_

```bash
git add "<files_you_have_changed>"
```

**9.** Commit your changes:

```bash
git commit -m "<your_commit_message>"
```

**10.** Push your local commits to the remote repository:

```bash
git push origin YourBranchName
```

**11.** Create a [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)! to the `preview` branch.

**12.** **Congratulations!** You've made your first contribution to [**TipoHiZ**](https://github.com/JhohannesK/TipoHiZ/graphs/contributors)! 🎉🙌🏼

---

## Building and Running TipoHiZ

Once you have completed the above steps, you are ready to build and run TipoHiZ.

1. Run `npm run install-all` in the project root to install all dependencies.
   -  If you are on Windows, use `npm run install-win`.
   -  If neither works, you will have to run `npm install` in root, frontend, and backend directories.
2. Run `npm run dev` (`npm run dev-fe` if you skipped the Backend section) to start a local dev server on [port 3000](http://localhost:3000). It will watch for changes and rebuild when you edit files in `src/` or `public/` directories. Note that rebuilding doesn't happen instantaneously so be patient for changes to appear. Use <kbd>Ctrl+C</kbd> to kill it.

**_:🏆🏆🏆: After this, the maintainers will review the PR and will merge it if it helps move the TipoHiZ project forward. Otherwise, it will be given constructive feedback and suggestions for the changes needed to add the PR to the codebase._**

---
