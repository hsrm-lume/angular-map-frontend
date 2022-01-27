# lume map view

In addition to the lume app used to share the fire among our users, a web app tracks shared fires on an interactive map. It also displays personal and general statistics.
A mobile view integrates the web app into the native app.
We used Angular for implementation, making it easier to implement some of our components thanks to its material package.

## Components

-   **App**  
    The app component is the main component of our project and is used to implement and call the other components. The Angular app uses a grid to arrange the individual components.

-   **Toolbar**  
We positioned the toolbar above the map. Next to the title, the toolbar contains a button to download the latest version of our APK. We linked the button to our latest app [release on Github](https://github.com/hsrm-lume/react-native-cli-lume/releases/latest/download/app-release.apk). If the user visits the web app from inside of the lume app, the toolbar will not be displayed.

-   **Map**  
    The map uses the Maplibre-GL framework. The lume map has two modes:

    1. Heat-Map
    2. Points-Map  
       Points are shown as flame pins and are clickable to show a path to children/parents and statistics.

-   **Statistics**  
     The user can view statistics by clicking the upper right button, which opens the sidebar.
    In this sidebar, we show general statistics across all flames. There are more tailored statistics if the user clicks a point or visits the map inside the lume app.

-   **Timeslider**  
The user can utilise the time slider to filter shown map data and statistics. After clicking a specific point, the user can drag the handle and see the map progress through time. To select a different timeframe, the user can modify the time slider with the zoom buttons.

-   **Mode control**  
    Besides the stats button, the pill contains toggles to switch to different map modes and toggle dark/light mode.

## Testing

Tests and linting are registered as branch protection for `main` and run on every pull request to `main` using the Workflow [Test & Lint](.github/workflows/main.yml).

## Backend connection

The data shown in the map view gets fetched directly from the Neo4j database using the [neo4j-service](src/app/services/neo4j-service.ts).

## Build

To automatically build the app as a Docker container, one can use the Github Action [Build & Publish Docker](.github/workflows/docker-publish.yml). It runs on the creation of a Github release.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.11.
