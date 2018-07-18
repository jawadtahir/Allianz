# [Allianz ICS]

## Environment ##
**Composer-Version:** v0.19.12  
**NPM-Version:** 6.1.0  


## Getting Started ##
 
Clone the repo.  
Go to ```/src/config.js```  
Run your local BCDB Instance  
Check if it has data ```./test.bcdb.py```  
Populate it with data if it is empty ```node populate_bcdb.js```  !!!! NOT PYTHON SCRIPT ANYMORE !!!!  
Run your IPFS Daemon(Not Required if src/config.js dev_mode: true,)  
npm install  
npm start  

go port 30001  

- We have already 5 different claims in BCDB and IPFS. You don't need to upload a file/insert something to BCDB to test it.  
- If you cannot see any claims while testing, please look at ```Populate and Test Big Chain Database``` section.  
- To be able to run an ipfs daemon, you should install it first. Please look at ```Install IPFS`` section.  
- To avoid any inconsistency problem, WAIT AFTER CREATING A BILL for 4 seconds before clicking any other tab.  

## Add Dummy Users to Hyperledger Blockchain ##
You need to add some dummy users to hyperledger blockchain and then create participants from them, to use login/logout functionality.  
After STARTING network, use ```composer-playground``` command to start playground.  
- Connect with ```admin@allianz-network```  
- Switch to test tab ```http://localhost:8080/test```  
- Create new OEs, you can use example files at  ```usersandoes/frenchoe.json``` and ```usersandoes/frenchoe.json```  
- Create new Users, and do not forget to give reference of related Oes. you can use example files at ```usersandoes/germanuser.json``` and ```usersandoses/frenchuser.json```  
- Click on ```admin``` string that top of right-top of page, then click on ```ID Registry```  
- Click on ```Issue new Id```, write German as ```Id name``` and select ```DE1``` as participant. Click Create-New and add it to your wallet.   
- Click on ```Issue new Id```, write French as ```Id name``` and select ```FR1``` as participant. Click Create-New and add it to your wallet.   

Now you can login with using ```German``` or ```French``` as username and their identity ids as password from ```localhost:30001/ics/login``` page.  
You can find identity ids from ```http://localhost:3000/explorer/#!/System/System_getAllIdentities````  

## Using Session Cookies ##
When npm start the Allianz project first opens login page and you should enter the name of the User Participant e.g: German if you used 
```usersandoes/germanuser.json``` and session cookie can be used in any other page by getting it using ```req.session.user``` in each controller javascript. e.g:```claimController``` it prints user details. For testing you can use cookie manager add-on for browser and can
delete the cookie and see if redirects or not. Also, you can use logout button on the top bar where user icon sits.

## How to Run Local BCDB instance ##
```git clone https://github.com/bigchaindb/bigchaindb```  
```cd bigchaindb```  
```make run```  

! If you are running a mongodb instance locally, bigchaindb cannot get started. You can stop your local mongodb instance with: ```sudo service stop mongodb stop```  

## Populate and Test Big Chain Database ##
If you cannot see any claims in ```/claims``` page then please follow these instructions:  
In this repo, there is one python script for testing, and one javascript file for populating 	
To use them first install bigchaindb-driver for python3  
```
pip3 install -U bigchaindb-driver
```
or if you want to use python2.x  
```
pip install -U bigchaindb-driver
```
First run ```node populate_bcdb.js``` and populate your bigchaindb, and then run ```test_bcdp.py``` to retrieve results  

## Install IPFS ##
To be able to run ```ipfs daemon``` that required for testing. First you must install ipfs to your system. Please follow these steps to install it:  

- Download IPFS according to your architecture/OS [from](https://dist.ipfs.io/#go-ipfs)  
- ```cd go-ipfs && ./install.sh```  
- ```ipfs init```  
- Look at your terminal and copy && paste the command that ipfs gave to you  
- Start Deamon with ```ipfs daemon```  

## Add File To IPFS, Get It From /Claims ##
To be able to add file to IPFS, first install IPFS and then follow these instructions:  

- Go to Allianz root then ```cd ipfs```  
- ```npm install && npm start``` (Wait until its started)  
- Start Daemon with ```ipfs daemon```  
- ```npm install && npm start```  
- Go to your web browser(http://localhost:3000), add your file  

## After creating bills , I cannot see any claim, What should I do?????? ##

Since we don't want that, users cannot create bills from SAME claim more than once, we change their metadata at BCDB after bill creation.  
However in ```dev``` mode, since we don't have ipfs we use a very simple json file to keep track of bill created/not-created files.  
check ```controllers/hardcoded_files.json```. Then set ```"created":``` values to ```true```. After that you can be able to see claims again.  
Actually in production, (which we use ipfs), it much more complicated, and you have to add new ipfs files to system, with right metadata's to see them.  
I will explain all steps in meeting, and then we can update documentation together.

## Documentations ##

[BCDB Python Driver](https://github.com/bigchaindb/bigchaindb-driver)  
[BCDB JS Driver](https://github.com/bigchaindb/js-bigchaindb-driver)  
[PUG-JS](https://pugjs.org/api/getting-started.html)  
[HTML-to-PUG*](http://html2jade.org/)  
[EXPRESS-DOCUMENTATION](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)  

* Developers changed Jade's name to PUG recently, so thats why that link directs to html2jade.org. It is not a mistake.  


### How to pull from Jawad's Repository ###
- ```git remote add upstream https://github.com/jawadtahir/Allianz.git```  
- ```git fetch upstream```  
- ```git checkout master```  
- ```git merge upstream/master```  

### How to get a pull request and work on top of it ###
- ```git fetch upstream pull/{pull-request-id}/head:{pull-request-owners-branch-name}  
