# Web Scraping
 A web scraping code to create a JSON file to train Watson Discovery on the IBM Cloud for the purpose of completing challenge #3 of the IBM - Behind The Code 2020 marathon.  Challenge link: https://github.com/maratonadev-br/desafio-3-2020

## Objective
Make it easy to capture data from Ted, OlharDigital and StartSe sites. This project is for learning purposes and not malicious.

 ## Requirements
 1. NodeJS
 2. Internet connection

 ## How To
 1. If you don't have NodeJS, [click here to visit the installation page](https://nodejs.org/pt-br/download/package-manager).
 2. Open the directory of project.
 3. Run *npm install* on the terminal.
 4. If the **json** folder does not exist, create.
 5. If the **list-sites.txt** file does not exist, create.
 6. Paste the URLs in the **list-sites.txt**, from sites Ted, OlharDigital and StartSe.The URLs are separated by a line break.
 7. Run *node app.js* on the terminal.
 8. The JSON files will be created in the **json** folder.