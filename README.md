# Lume map view

In addition to the Lume app, which is used to share the fire, there is a web app for tracking the fires
on an interactive map. It also displays personal and general statistics.
There is a mobile view to integrate the web app into the app.
We used Angular for implementation, which made it easier to implement some of our components thanks to its material package.

## Components

-   **App**  
    The app component is the main component of our project and is used to implement and call the other components. Grid is used to arrange the individual components.

-   **Toolbar**  
    The toolbar is located above the map. Next to the title it contains a button to download the latest version of our APK. The button is linked to our latest app [release on Github](https://github.com/hsrm-lume/react-native-cli-lume/releases/latest/download/app-release.apk)
    The toolbar is not displayed if the map is viewed inside of the lume App.

-   **Map**  
    The map uses the Maplibre-GL framework. The lume map has two modes:

    1. Heat-Map
    2. Points-Map  
       Points are shown as flame pins and are clickable to show path to childs/parents and statistics.

-   **Statistics**  
     Statistics can be viewed by clicking the upper right button, which opens the sidebar.
    In this sidebar, general statistics across all flames are shown. If a point is clicked and/or the map is viewed in the lume app there are more specific-tailored statistics.

-   **Timeslider**  
     The timeslider can be used to filter shown map data and statistics. By dragging the handle, you can see the map view as of the selected point in time. To select the time shown more perciseley, the zoom buttons can be used to modify the time range covered by the slider.

-   **Mode control**  
    The pill besides the stats button contains Toggles to switch to different map modes and toggle dark/light mode.

## Testing

Tests and linting is registered as a branch protection for main and runs on every PR to main using the Workflow [Test & Lint](.github/workflows/main.yml).

## Backend connection

The data shown in the mpa view gets fetched directly from the Neo4j database using the [neo4j-service](src/app/services/neo4j-service.ts).

## Build

To automatically build the app as a Docker container, the GitHub Action [Build & Publish Docker](.github/workflows/docker-publish.yml) can be used. It runs on creation of a GitHub release.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.11.
