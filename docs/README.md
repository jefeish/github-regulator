# Quickstart

## Overview

The Policy App process flow

![overview](images/policy-flow.png)

## Register the App

See [installing-github-apps](https://docs.github.com/en/developers/apps/managing-github-apps/installing-github-apps)

## Run the App

- Development

    ```bash
    npm run dev
    ```

- Production

    ```bash
    npm start
    ```

## Write Policies

- Open the Policy UI
  - Sample: http://localhost:3000/policy-app
  
## Configure the App (Application Host)

- Configure your App settings in [config.yml](https://github.com/jefeish/policy-app/blob/main/.github/config.yml)

  **Sample**

  ```yaml
  ---
  # Determine a Repo in your Org to provide 'client-side rules' (located under `.github/rules/`)

  # With `.`, the App will look for client-side rules in the Repo that triggered the event.
  # This makes it a 'local' client-side rule. 
  # If you provide a specific Repo to store your rules in, you create a 'centralized' client-side rule.
  # 'Client-side' rules (local or centralized) are controlled by the Repo owner.
  #  
  # Note: Any incoming event gets evaluated against 'Server-side and 'Client-side' rules!


  # Options: `Repo name` or `.` 
  rules_repo: rules-repo

  # This is a "Lazy Refresh". We only check on an incoming event, if the interval expired.
  # The reload interval for client-side rules, in minutes.
  rules_refreshInterval: 1
  ```

  ##