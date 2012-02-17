Banana JS Framework hello world application build
------------------

This hello world demo shows a development environment in which you can easily work with seperate .js files.
The idea is that you include only Application.js and let the application handle the inclusion of the correct .js files.
After adding new files in your application, you need to provide and require the file.
To finalize we need to run the make command.
Look at the application/pages/MyPage.js and Application.js to see the 'require' and 'provide' usage.
index_debug.html is using the deps.js file in order to include .js files prior to application contruction. 

During deployment you likely want to create one big js file. You can do that by running 'make release'.
It creates an Application.min.js with all the required js files minified.
Index.html is using the minified version. Changes made in your application files won't be visible unless you run 'make release'

Normally while developing you use the index_debug.html to quickly see changes. index.html is for final deployment only.

Note: to build you need google compiler.jar, GNU make, Java, and Python installed. 
windows users can find GNU make at http://gnuwin32.sourceforge.net/packages/make.html.
run 'build/compiler.jar' to automatically install the required google compiler.


goodluck!


 
 

