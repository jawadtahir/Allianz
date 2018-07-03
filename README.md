# [Allianz ICS]

## Getting Started

Clone the repo.  
Go to ```/src/config.js```  
Put your own ```APP_ID``` and ```APP_KEY```  
Run your local BCDB Instance  
Check if it has data ```./test.bcdb.py```  
Populate it with data if it is empty ```./populate_bcdp.py```  
Run your IPFS Daemon  
npm install  
npm start  

go port 30001  

- We have already 5 different claims in BCDB and IPFS. You don't need to upload a file/insert something to BCDB to test it.  
- If you cannot see any claims while testing, please look at ```Populate and Test Big Chain Database``` section.  
- To be able to run an ipfs daemon, you should install it first. Please look at ```Install IPFS`` section.  

## How to Run Local BCDB instance ##
```git clone https://github.com/bigchaindb/bigchaindb```  
```cd bigchaindb```  
```make run```  

! If you are running a mongodb instance locally, bigchaindb cannot get started. You can stop your local mongodb instance with: ```sudo service stop mongodb stop```  

## Populate and Test Big Chain Database ##
If you cannot see any claims in ```/claims``` page then please follow these instructions:  
In this repo, there are two python scripts for bigchain.db 	
To use them first install bigchaindb-driver for python3  
```
pip3 install -U bigchaindb-driver
```
or if you want to use python2.x  
```
pip install -U bigchaindb-driver
```
After that please go to [BCDB-Test](https://testnet.bigchaindb.com), and create an account for yourself.[1]  
Then navigate to Applications -> Your app's name, and find your Application ID and Application Keys.  
Copy and paste them into ```populate_bcdp.py``` and ```test_bcdp.py```  
Then first run ```populate_bcdp.py``` and populate your bigchaindb, and then run ```test_bcdp.py``` to retrieve results  

[1] -> You can use my ApplicationId and Application key, that I shared via slack-channel.  

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
