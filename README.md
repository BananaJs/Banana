What is Banana?
------------------

Banana is an open source javascript application framework designed to create pure javascript webpages.
Banana is designed with the single goal to allow developers write fast and efficient web applications.
Compatible with all recent browsers, Banana gives developers a component driven platform to develop applications just in the same way regular interface toolkits provides.
It is fast, dynamic, flexible and easy to use.

Some key features of Banana are:

* 100% Javascript
* Component driven
* Event based programming
* Fast dom render engine
* Flexible and dynamic
* History management
* large control collection
* Advanced list/item renders
* Validation
* Databinding
* JQuery powered
* Google Closure build integration


Usage
------------

There are 2 common ways to use Banana

1. Standalone application
2. Widget in an existing enviroment


Standalone application
------------

A standalone application means that the entire contents of your application is rendered by Banana framework.
Banana offers its own paging engine with history management. 
Sometimes large javascript applications gives developers problems with managing various javascript files spread accross the application. 
Banana solves this by handling all the file inclusions. This is useful during development. For production enviroments Banana creates a minified js file of the entire application.   


Widget in an existing enviroment
-------------

If you want to decorate your page with features from Banana you can include one or more instances of the Banana application.
If offers the same functionality as the standalone application. Example is a static rendered webshop enviroment
with dynamic generated search results.  


Requirements
------------

During development the standalone application needs the following tools:

* googlecompiler.jar - for creating dependency files of required js files. 
* GNU make
* Java 
* Python 


Quick installation and usage tour for the standalone application.
------------

1. Download Banana from http://www.bananajs.com or use git and unpack it somewhere locally or on a webserver.  
2. Go to the application/pages folder in the root and open up Home.js
3. Enter in the createComponents function "this.addControl("helloworld");" and save your file.
4. Open up index_debug.html in your browser. Voila your first hello world.
5. Open index.html. you will get an empty page. Index.html is an example of a production environment and not using the file inclusion stuff. Instead it just used a minified version of your application and Banana Framework. 
   Run "make release" from your console to create a minified file. Now refresh index_debug.html to see the result.
6. Create a new file in application/pages lets say "MyPage.js" 
7. Open up Home.js and copy all the contents to MyPage.js. Change the classname to MyPage. Also change "goog.provide('Application.Pages.Home');" to "goog.provide('Application.Pages.MyPage')";  
8. Open Application.js in the root and add "goog.require('Application.Pages.MyPage')"
9. Go to your console and run "make" to create a deps.js file (required to ensure correct inclusion of js files)
10.Also run "make release" to get the production enviroment working.
11.Now open either index.html or index_html and change the parameter in the section tag to "MyPage". There you go!

A good reference and starting point for the standalone application is the helloworld_standalone_application in the demos folder.


More information
------------

See http://www.bananajs.com for more information, demo's and references.


Contributing
------------

Banana is free, open source and waiting for user contributions. Banana loves to see people creating new controls to enrich
the library of Banana.