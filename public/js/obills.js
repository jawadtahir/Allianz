SELECTED_UNAUTH_INDEX = 0;
ID_UNAUTH_INDEX = 1;
ID_CALC_INDEX = 0;
PENALITY_CALC_INDEX = 4;

NAMESPACE = "de.tum.allianz.ics.";
RESOURCE = "resource:de.tum.allianz.ics.";

function calculatePenality(){
    var dataTable = document.getElementById('dataTables-unauth');
    var tranData = new Object();
    tranData.$class = NAMESPACE+"calculatePenalty";
    var billIds = [];
    for (var i = 1; i < dataTable.rows.length; i++){
        var checkBox = dataTable.rows[i].cells[SELECTED_UNAUTH_INDEX].children[0];
        if (checkBox.checked){
            billIds.push(dataTable.rows[i].cells[ID_UNAUTH_INDEX].innerText);
        }
    }
    tranData.billIds = billIds;
    $.post("/ics/calc", tranData, function(reponse){
        console.log(reponse);
        $("#myModal").css({display: "block"});
        rows = "";
        for (var i = 0; i < reponse.length ; i++){
            rows += createRow(reponse[i]);
        }
        $("#dataTables-bills").find('tbody:last').append(rows);
    });
}

function createRow(bill){
    var dueDate = new Date( bill.dueDate);
    dueDate = dueDate.toLocaleDateString();
    var retVal = "<tr>";
    retVal += "<td>"+bill.billId+"</td>";
    retVal += "<td>"+dueDate+"</td>";
    retVal += "<td>"+bill.totalAmount+"</td>";
    retVal += "<td>"+bill.handlingFee+"</td>";
    retVal += "<td>"+bill.latePenality+"</td>";
    retVal += "<td>"+bill.totalOutstanding+"</td>";
    retVal += "</tr>";
    return retVal;
}

function closeCalcModal(){
    $("#dataTables-bills").find('tbody:last').find("tr").remove();
    $("#myModal").css({display: "none"});
}

function payBills(){
    var dataTable = document.getElementById('dataTables-bills');
    var payTranData = new Object();
    payTranData.$class = NAMESPACE+"Pay";
    payTranData.amount = 0;
    var billList = [];
    for (var i = 2; i < dataTable.rows.length; i++){
        var bill = new Object();
        bill.$class = NAMESPACE + "BillConcept";
        bill.BillConceptID = dataTable.rows[i].cells[ID_CALC_INDEX].innerText;
        bill.billId = dataTable.rows[i].cells[ID_CALC_INDEX].innerText;
        bill.latePenality = dataTable.rows[i].cells[PENALITY_CALC_INDEX].innerText;
        billList.push(bill);
    }
    payTranData.bills = billList;

    $.post('http://localhost:3000/api/Pay', payTranData, function(res){
        location.reload();
    })
}

function onClickAuth(billId){
    var authTranData = new Object();
    authTranData.$class = NAMESPACE+"Authorize";
    authTranData.bill = RESOURCE+"Bill#"+billId;
    authTranData.user = RESOURCE+"User#"+USER.userId;
    authTranData.authDate = new Date().toJSON();

    $.post('http://localhost:3000/api/Authorize', authTranData, function(response){
        location.reload();
    });
}