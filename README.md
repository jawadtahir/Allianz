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

To install and start the network for Hyperledger code:

- Create .bna file : ```composer archive create -t dir -n allianz-network```
- Create PeerAdmin card (give the location of connection.json, cert and private key files to following command) :  
    ```composer card create -p connection.json -u PeerAdmin -c Admin@org1.example.com-cert.pem -k 114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk -r PeerAdmin -r ChannelAdmin```
- Import PeerAdmin card : ```composer card import -f PeerAdmin@allianz-network.card```
- Install network with previously created bna (version of .bna is important) : 
    ```composer network install -c PeerAdmin@allianz-network -a tutorial-network@0.0.36.bna```
- Start the network : 
    ```composer network start --networkName allianz-network --networkVersion 0.0.36 -A admin -S adminpw -c PeerAdmin@allianz-network```
- To start rest server ("never use namespace" and "no" to every option):  composer-rest-server 
    go to ```localhost:3000/explorer```
- To start the project:
    npm start in another terminal
    go to ```localhost:30001/ics```


- We have already 7 different claims in IPFS Network. You don't need to upload a file/insert something to IPFS before testing.  
- If you cannot see any claims while testing, please look at ```Populate and Test Big Chain Database``` or ```After creating bills , I cannot see any claim, What should I do?``` section.  
- To be able to run an ipfs daemon, you should install it first. Please look at ```Install IPFS``` section.  
- To avoid any inconsistency problem, WAIT AFTER CREATING A BILL for 3 seconds before clicking any other tab.  

## Add Dummy Users to Hyperledger Blockchain ##
You need to add some dummy users to hyperledger blockchain and then create participants from them, to use login/logout functionality.  
After STARTING network, use ```composer-playground``` command to start playground.  
- Connect with ```admin@allianz-network```  
- Switch to test tab ```http://localhost:8080/test```  
- Create new OEs, you can use example files at  ```usersandoes/frenchoe.json``` and ```usersandoes/frenchoe.json```  
- Create new Users, and do not forget to give reference of related Oes. you can use example files at ```usersandoes/germanuser.json``` and ```usersandoses/frenchuser.json```  
- Lastly create an authorizer-User for French OE's to be able to complete workflow. You can use frenchauth.json for that  
- Click on ```admin``` string that top of right-top of page, then click on ```ID Registry```  
- Click on ```Issue new Id```, write German as ```Id name``` and select ```DE1``` as participant. Click Create-New and add it to your wallet.   
- Click on ```Issue new Id```, write French as ```Id name``` and select ```FR1``` as participant. Click Create-New and add it to your wallet.   
- Click on ```Issue new Id```, write FrenchAuth as ```Id name``` and select ```FR2``` as participant. Click Create-New and add it to your wallet.  

Now you can login with using ```German``` or ```French``` as username and their identity ids as password from ```localhost:30001/ics/login``` page.  
You can find identity ids from ```http://localhost:3000/explorer/#!/System/System_getAllIdentities```  

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
That section about adding a new file to ipfs as a claim, and get it from our hyperledger apps claims section  

First lets analyze a basic claim json file structure. (You can find some example files in /ipfs-jsons directory)  
```
{"claim_id":"1","claim_date":"2018/06/20","ooe":"FR","hoe":"DE","sum_expense":"10000"}
```
- claim_id -> Claim ID  
- claim_date -> a date but be aware of format  
- ooe -> After hoe creates bill, it will appear related ooe's page. So you should give a vaild ooe(for example if you have DE and FR accs give ooe to FR and hoe to DE etc)  
- hoe -> Handler oe, if you want to see it in claims tab, your hoe code in file, and your login id should match (if you login with DE acc, you can only see claims which have DE as hoe)  
- sum_expense -> it is important for authorization stuff, if you want to test authorization give a big number such as 90000.  

First of all create your new claim file with following that format, change its extension to .json  

- Start IPFS-Daemon with ```ipfs daemon```  
- Open page ```http://localhost:5001/webui``` with your web browser  
- Click to Files Section, upload your file, and then get hash of it by right click it -> select copy hash.  
- Start your local BCDB instance  
- Now you must change populate_bcdb.js to be able to add your new claim to bcdb. Open that file in a text editor.  
- Remove all current objects in claims array except first one(if you want to add two files keep 2 etc). Change its ipfs_file_hash value to your new file hash(you got it with right clicking in three steps before)  
- Run ./populate_bcdb.js sometimes it may take 2-3 mins. Then test it with ./test_bcdb.js to be sure about that process completed successfully.  
- Login with account which is identical to ```hoe``` field in uploaded json file. You should be able to see it in /claims tab  

## After creating bills , I cannot see any claim, What should I do? ##

Since we don't want that, users cannot create bills from SAME claim more than once, we change their metadata at BCDB after bill creation.  
However in ```dev``` mode, since we don't have ipfs we use a very simple json file to keep track of bill created/not-created files.  
check ```controllers/hardcoded_files.json```. Then set ```"created":``` values to ```true```. After that you can be able to see claims again.  
Actually in production, (which we use ipfs), it much more complicated, and you have to add new ipfs files to system, with right metadata's to see them.  
I will explain all steps in meeting, and then we can update documentation together.

## An Example Workflow ##
!! Since I can't use ipfs right now, in following steps assume that dev_mode is true !!  
We will use German, French and FrenchAuthorizer accounts during workflow. If you need some help for setting them up, please visit ```Add Dummy Users to Hyperledger Blockchain``` Section.   
- Login with German User  
- Click Complated Claims Tab  
- Select 2nd, 3rd and 4th claims and click on create bill button  
- Validate 3 different bills created (since 2nd, 3rd and 4th has different oes) with ```http://localhost:3000/explorer/#!/Bill/Bill_find```  
- Click on handling bills tab, and in here you can see the bills you created in one step before. As you can see since French one's expense is higher than threshold it needs authorization.  
- You can click view-details to show status/history of bill  
- Logout and login as French-Authorizer.  
- Go to Owning Bills Section and and click ```Auth``` button.  
- You can pay with FrenchAuth user too, but for a better flow, logout from FrenchAuth user and login with French user
- Click on owning bills again, and click on pay button.  
- Now logout and then login with German account again.  
- Click on handling bills tab. Now you can observe that, French Bills status changed to SETTLED from NEEDSAUTH. You can click on view details to show history of that bill.  

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
- ```git fetch upstream pull/{pull-request-id}/head:{pull-request-owners-branch-name}  ```

### Configuration required to enable History ###
Modify ```./fabric-tool/fabric-scripts/hlfv1/composer/docker-compose.yaml``` in ```composer``` to have ```- CORE_LEDGER_HISTORY_ENABLEHISTORYDATABASE=true``` setting in environmt of peer 0

