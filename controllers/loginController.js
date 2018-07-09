const path = require('path');
const fs = require('fs');
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-filesystem' } );
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const namespace = 'de.tum.allianz.ics';
const assetType = 'SampleAsset';
const assetNS = namespace + '.' + assetType;
const participantType = 'OE';
const participantNS = namespace + '.' + participantType;
const adminCardName = 'admin';
const connectionProfile = require('../allianz-network/connection.json')


exports.get_login_page = function(req, res) {
    ImportAdminCard();
	res.render(path.join(__dirname, "../public/pages/login"));
};

exports.LoginButtonReq= function(req, res) {
    console.log('Hande');
    console.log(req);
};


async function ImportAdminCard() {
   // Generate certificates for use with the embedded connection
   const credentials = CertificateUtil.generate({ commonName: 'admin' });

   // Identity used with the admin connection to deploy business networks
   const deployerMetadata = {
       version: 1,
       userName: 'PeerAdmin',
       roles: [ 'PeerAdmin', 'ChannelAdmin' ]
   };
   console.log('Check1');
   const deployerCard = new IdCard(deployerMetadata, connectionProfile);
   deployerCard.setCredentials(credentials);
   const deployerCardName = 'PeerAdmin@allianz-network';
   console.log('Check2');
    adminConnection = new AdminConnection({ cardStore: cardStore });
    console.log('Check3');
    await adminConnection.importCard(deployerCardName, deployerCard);
    console.log('Card Imported');
    await adminConnection.connect(deployerCardName);
    console.log('Connected');
    let businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '../allianz-network'));
        businessNetworkName = businessNetworkDefinition.getName();
        console.log(businessNetworkName)
        console.log(businessNetworkDefinition)
        await adminConnection.install(businessNetworkDefinition);
        const startOptions = {
            networkAdmins: [
                {
                    userName: 'admin',
                    enrollmentSecret: 'adminpw'
                }
            ]
        };
        const adminCards = await adminConnection.start(businessNetworkName, businessNetworkDefinition.getVersion(), startOptions);
        await adminConnection.importCard(adminCardName, adminCards.get('admin'));
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });
        events = [];
        businessNetworkConnection.on('event', event => {
            events.push(event);
        });
        await businessNetworkConnection.connect(adminCardName);
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        console.log(factory);
        const participantRegistry = await businessNetworkConnection.getParticipantRegistry(participantNS);
        // Create the participants.
        //const alice = factory.newResource(namespace, participantType, 'DE');
       // alice.name = 'Germany';
}


