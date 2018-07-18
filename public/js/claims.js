
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
			console.log(dataTable.rows[i]);
			dataTable.rows[i].style.display = 'none';
            var claim = new Object();
            claim.$class = NAMESPACE+"Claim";
            claim.ClaimId = dataTable.rows[i].cells[CLAIMNO_INDEX].innerText;
            // TODO: Store hash of claim file
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
        transactionData.hoe = RESOURCE+"OE#"+USER.userOe;
        transactionData.billId = Math.random().toString(36).substr(2, 15);
        transactionData.claims = ooeToClaimMap[oe];
        transactionData.dueDate = new Date();
        transactionData.dueDate.setMonth(transactionData.dueDate.getMonth() + 2);
        transactionData.dueDate = transactionData.dueDate.toJSON();
		//console.log(transactionData)
        $.post("http://localhost:3000/api/CreateBill", transactionData, function(response){
            //location.reload(); @Jawad I commented it, since it breaks element-hiding, but if neccessary i can uncomment it again and find another way to fix it.
        }).done(function(response){
            //console.log(response)
			updateBCDB(transactionData); //Update only if result is done
        }).fail(function(error){

        });

    }
}

function updateBCDB(transactionData) {
		$.post("http://localhost:30001/ics/claims", transactionData, function(response) {
			}).done(function(response) {
			}).fail(function(response) {
				console.log(response);
			});
}

function hideRows() {

}
