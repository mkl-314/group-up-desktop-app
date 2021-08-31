Create new project React Typescript in command line:  
npx create-react-app my-app --template typescript

For auto formatting:  
npm i -D tslint  
npm i -D prettier

https://abiodun.dev/import-spreadsheets-or-excel-in-your-react-component/ 

https://itnext.io/create-desktop-with-electron-react-and-c-86f9765809b7

https://www.npmjs.com/package/electron-cgi
Excel Importer:   
https://stackoverflow.com/questions/61464902/reading-excel-file-in-angular-with-header-at-row-number-n


Deployment:   
Front end:
packager-manager   
or package-builer   
https://www.electronjs.org/docs/tutorial/application-distribution
https://medium.com/how-to-electron/a-complete-guide-to-packaging-your-electron-app-1bdc717d739f   
This is best for package-builder: https://medium.com/red-buffer/electron-builder-packaging-electron-nodejs-application-along-with-flask-app-for-windows-fc26f5a29870


Back end:
Run command in project directory (makes one exe file only):   
dotnet publish -r win-x64 -c Release /p:PublishSingleFile=true /p:PublishTrimmed=true   
OR use publish menu in Visual Studio



Reduce .exe file size:
https://stackoverflow.com/questions/47597283/electron-package-reduce-the-package-size
