
CHECKBOX_INDEX = 0;
CLAIMNO_INDEX = 1;
CLAIMDATE_INDEX = 2;
OOE_INDEX = 3;
SUMEXPENSE_INDEX = 4;
FILE_INDEX = 5;

NAMESPACE = "de.tum.allianz.ics.";
RESOURCE = "resource:de.tum.allianz.ics.";

function createBill(){
    var dataTable = document.getElementById('dataTables-example');
    var claimsList = [];
    var ooeToClaimMap = {};
    for (var i = 1; i < dataTable.rows.length; i++){
        
        var checkBox = dataTable.rows[i].cells[CHECKBOX_INDEX].children[0];
        if (checkBox.checked){

            var claim = new Object();
            claim.$class = NAMESPACE+"Claim";
            claim.ClaimId = dataTable.rows[i].cells[CLAIMNO_INDEX].innerText;
            claim.owner = RESOURCE+"OE#"+dataTable.rows[i].cells[OOE_INDEX].innerText;
            claim.handler = RESOURCE+"OE#DE";
            claim.hash = "djfjbguorowfoiwjhfownjndgjowgb";
            claim.totalAmount = dataTable.rows[i].cells[SUMEXPENSE_INDEX].innerText;
            claimsList.push(claim);
            if (ooeToClaimMap[dataTable.rows[i].cells[OOE_INDEX].innerText] == undefined){
                ooeToClaimMap[dataTable.rows[i].cells[OOE_INDEX].innerText] = [];
            }
            ooeToClaimMap[dataTable.rows[i].cells[OOE_INDEX].innerText].push(claim);
        }

    }

    for (var oe in ooeToClaimMap){
        var transactionData = new Object();
        transactionData.$class = NAMESPACE+"CreateBill";
        transactionData.ooe = RESOURCE+"OE#"+oe;
        transactionData.hoe = RESOURCE+"OE#DE";
        transactionData.billId = Math.random().toString(36).substr(2, 15);
        transactionData.claims = ooeToClaimMap[oe];
        transactionData.dueDate = new Date();
        transactionData.dueDate.setMonth(transactionData.dueDate.getMonth() + 2);
        transactionData.dueDate = transactionData.dueDate.toJSON();

        $.post("http://localhost:3000/api/CreateBill", transactionData, function(response){
            console.log("Inner");
            console.log(response);
        }).done(function(response){
            console.log(response);
        }).fail(function(error){
            console.log(error);
        });

    }
}