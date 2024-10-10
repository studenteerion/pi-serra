# pi-serra
Un'applicazione per l'utilizzo di sensori e attuatori per serre intelligenze tramite l'utilizzo di microcontrollori ESP. **pi-serra** offre un'interfaccia web per il controllo dell'ambiente in cui è utilizzata.# pi-serra
Un API per l'utilizzo di sensori ed attuatori collegati in rete tramite ESP con database per l'archiviazione dei dati e una web application che permette di monitorare la serra tramite i dati priovenienti dai sensori, eseguire operazioni con gli attuatori e vedere una diretta streaming dalla serra.
## Features:
- Aggiunta semplice di sensori ed attuatori
- Interfaccia web moderna per desktop e mobile
- Possibilità di espansione infinite grazie all'API
## Screenshots
![A screenshot of the dashboard](./newebapp_mockup_screenshots/Screenshot%202024-05-18%20231354.png)
![Screenshot](newebapp_mockup_screenshots/Screenshot%202024-05-18%20231649.png)

## How we want to implement pi-serra in our school
The greenhouse will have its own network within which all the sensors and actuators will be connected.
In our case we will have a first ESP to which the temperature and humidity sensor is connected.
A second ESP to which the lighting is connected.
And a third to which the water pump is connected.
The Wi-Fi camera will also be present in the same network.

The raspberry will be connected via Wi-Fi to this network so that it can obtain data from the sensors and transmit commands to the actuators.

However, Raspberry pi 4 has both a Wi-Fi network card and an ethernet network card.
The ethernet network card will be connected via cable to the school's network.

The two panels will then be connected to the same network. A few years ago the school was equipped with a large number of tablets that are no longer used because they are too old. We therefore installed an updated web browser on them that is compatible with the version of Android installed on those tablets and we connected them to the Paleocapa network. We then set them so that at startup the web browser that points to the web application is started and so that it is not possible to exit from it.

The web application being exposed to the school network means that from any place in Paleocapa it is possible to monitor the greenhouse.

The greenhouse network is isolated from the rest so as not to burden the number of IP addresses available in the school network and also so as to limit vulnerabilities since the only device that can be contacted is the Raspberry and not the ESPs or the camera.
