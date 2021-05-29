# AnomalyDetectionWebApp
**Preview from AnomalyDetectionWebApp**

![WhatsApp Image 2021-05-23 at 15 30 36](https://user-images.githubusercontent.com/62257681/119260711-aa579d80-bbdc-11eb-8326-011a3e69e604.jpeg)

# Brief explanation of the project:

This program implements a web-based for anomaly detection algorithms, to make them accessible to an audience of different
consumers, from regular users to automated services.
The general parts of the program:
1) RESTful API that accessible via HTTP protocol. At this project we use node.js which implements the RESTful API.
2) WEB user application - a web page that is accessible from the browser and the user can upload data-files and find detections in them.


# Added Features

* **Drop boxes** - the user will be able to drag files into them. There are two drop boxes, one for train files, and the other for the anomaly files.
* **Moving button** - the user can choose to use the regression mode or to move the button for choosing the hybrid mode.
* **Upload button** - after dragging the files into the drop boxes and choosing the wanted detection mode, the user can press this button for
  uploading the files to the anomaly detector. 
* **Button toggle between pages** - On the right side of the screen there is a button that can be used to switch between the various pages on the site without using the mouse wheel
 Note: at the left side of the screen will appear a table with the results of the anomalies. 
 
 
# The structure of the folders and the main files of the project
We used MVC architecture (Model, View, Controller).
The Model folder has the files that implements the anomaly detection algorithms. It returns a JSON file with 
the anomalies.
The Controller folder implements the server code.
The View folder implements the code for HTML page that will be presented to the user.


# Required installation and Preparations

1) Recommended work environment: Webstorm, VS-Code.
2) Use this [tutorial](https://expressjs.com/en/starter/installing.html) for the installations required to work with 'express' library.
3) Open the command prompt, and in the project's folder install: express-fileupload
4) [link](https://nodejs.org/en/download/) to install node.js
5) install the library of smallest-enclosing-circle with the command: npm install smallest-enclosing-circle
6) install 'html tablify'


# Running 
Open the command-promp and get in the project directory. Then, get in the controller directory.
Use the command: node expServer.js . After that, the server will wait for the detection files.
Now, you can open a page by the adress 'localhost:8080' or send HTTP POST-command to the 'localhost:8080' adress.

The page that will show after ruuning:
![WhatsApp Image 2021-05-23 at 15 30 54](https://user-images.githubusercontent.com/62257681/119260715-ae83bb00-bbdc-11eb-91eb-e0ba1f860af3.jpeg)

# UML Chart:
Press [here](https://github.com/asafmor13/anomalydetectionwebapp/blob/master/UML%20webapp.png) to get the UML of the main classes.

# Explanation Video:
Press [here](https://www.youtube.com/watch?v=p2naQ8PtQY8&ab_channel=%D7%90%D7%A1%D7%A3%D7%9E%D7%95%D7%A8) to watch the explanation video.
