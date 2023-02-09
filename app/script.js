var leadId;
var entity;
var entityId;
var sub_button = document.getElementById("submit");
ZOHO.embeddedApp.on("PageLoad", function (data) {
    console.log(data);
    leadId = data.EntityId;
    entity = data.Entity;
    entityId = data.EntityId;
    fetchRecordInfo();
    visa_refusal();
    crim_hist();
    physical();
    relationship_status();
    kid_op();
    med_options();
    country_list();
});
//fetching the existing data and displaying
function fetchRecordInfo() {
    const Eligibility = ZOHO.CRM.API.searchRecord({
        Entity: "Eligibility",
        Type: "criteria",
        Query: `(Lead:equals:${leadId})`,
        delay:false,
    })
        .then(function (response) {
            console.log(response);
            // console.log(response.data.length);
            // console.log(response.data[0].id);
            if (response.data != undefined) {
                response.data.forEach((element) => {
                    var visa_cell = document.getElementById("visa_refusal_options");
                    visa_cell.value = element.Visa_Refusal_from_any_previous_country;
                    var ref_country_cell = document.getElementById("ref_country");
                    ref_country_cell.value = element.From_Which_Country;
                    var reas_for_ref_cell = document.getElementById("reason_for_ref");
                    reas_for_ref_cell.value = element.Reason_for_refusal;
                    var crim_his = document.getElementById("crim_history");
                    crim_his.value = element.Criminal_History;
                    var crim_details_cell = document.getElementById("crim_his_details");
                    crim_details_cell.value = element.Criminal_History_Details;
                    var medical_cell = document.getElementById("medi_issues");
                    medical_cell.value = element.Any_medical_issue_allergies;
                    var climate_cell = document.getElementById("climate_details");
                    climate_cell.value = element.Does_climate_impact_above_health_issues;
                    var medical_details_cell = document.getElementById("med_details");
                    medical_details_cell.value = element.Medical_issue_allergies_details;
                    var physical_details_cell = document.getElementById("phy_dis");
                    physical_details_cell.value = element.Physical_Disability;
                    var disability_details_cell = document.getElementById("dis_details");
                    disability_details_cell.value = element.Physical_Disability_Details;
                    var rel_status_cell = document.getElementById("rel_status");
                    rel_status_cell.value = element.Married;
                    var kids_cell = document.getElementById("kids_option");
                    kids_cell.value = element.Have_Kids;
                    var kids_details_cell = document.getElementById("kids_det");
                    kids_details_cell.value = element.Kids_Details;
                    var any_observations_cell = document.getElementById("any_obser");
                    any_observations_cell.value = element.Any_other_observation;
                    var file_name_cell = document.getElementById("doc_name");
                    console.log(element.Document);
                    if (element.Document != null) {
                        console.log(element.Document[0].file_Name);
                        file_name_cell.value = element.Document[0].file_Name;
                        file_name_not_empty();
                    } else if (element.Document == null) {
                        file_name_empty();
                    };
                    visa_refusal();
                    crim_hist();
                    physical();
                    relationship_status();
                    kid_op();
                    med_options();
                    sub_button.addEventListener("click", (e) => {
                        e.preventDefault();
                        document.getElementById("cover-spin").style="display:inherit";
                        console.log(`Clicked to Update`);

                        var update_data = {
                            Visa_Refusal_from_any_previous_country: document.getElementById("visa_refusal_options").value,
                            From_Which_Country: document.getElementById("ref_country").value,
                            Reason_for_refusal: document.getElementById("reason_for_ref").value,
                            Criminal_History: document.getElementById("crim_history").value,
                            Criminal_History_Details: document.getElementById("crim_his_details").value,
                            Any_medical_issue_allergies: document.getElementById("medi_issues").value,
                            Does_climate_impact_above_health_issues: document.getElementById("climate_details").value,
                            Medical_issue_allergies_details: document.getElementById("med_details").value,
                            Physical_Disability: document.getElementById("phy_dis").value,
                            Physical_Disability_Details: document.getElementById("dis_details").value,
                            Married: document.getElementById("rel_status").value,
                            Have_Kids: document.getElementById("kids_option").value,
                            Kids_Details: document.getElementById("kids_det").value,
                            Any_other_observation: document.getElementById("any_obser").value,

                            id: response.data[0].id
                        };

                        update_record = ZOHO.CRM.API.updateRecord({
                            Entity: "Eligibility",
                            APIData: update_data,
                            // Trigger: ["workflow"]
                        })
                            .then(function (data) {
                                console.log(data);
                                // fetchRecordInfo();
                                location.reload();
                                lock_fields();
                                document.getElementById("cover-spin").style="display:none";
                        
                            })
                            
                        });

                });
            } else if (response.data == undefined) {          
                sub_button.addEventListener("click", (e) => {
                    e.preventDefault();
                    document.getElementById("cover-spin").style="display:inherit";
                    console.log(`Clicked`);
                    var fileid;
                    var file = document.getElementById("file").files[0];
                    if (file != undefined) {
                        console.log("not empty");
                        var config = {
                            CONTENT_TYPE: "multipart",
                            PARTS: [{
                                headers: {
                                    "Content-Disposition": "file;",
                                },
                                content: "__FILE__",
                            },],
                            FILE: {
                                fileParam: "content",
                                file: file,
                            },
                        };
                        ZOHO.CRM.API.uploadFile(config).then(function (resp) {
                            console.log("uploaded file");
                            console.log(resp);
                            fileid = resp.data[0].details.id;
                            console.log(`fileid=${fileid}`);
                            var new_data = {
                                Visa_Refusal_from_any_previous_country: document.getElementById("visa_refusal_options").value,
                                From_Which_Country: document.getElementById("ref_country").value,
                                Reason_for_refusal: document.getElementById("reason_for_ref").value,
                                Criminal_History: document.getElementById("crim_history").value,
                                Criminal_History_Details: document.getElementById("crim_his_details").value,
                                Any_medical_issue_allergies: document.getElementById("medi_issues").value,
                                Does_climate_impact_above_health_issues: document.getElementById("climate_details").value,
                                Medical_issue_allergies_details: document.getElementById("med_details").value,
                                Physical_Disability: document.getElementById("phy_dis").value,
                                Physical_Disability_Details: document.getElementById("dis_details").value,
                                Married: document.getElementById("rel_status").value,
                                Have_Kids: document.getElementById("kids_option").value,
                                Kids_Details: document.getElementById("kids_det").value,
                                Any_other_observation: document.getElementById("any_obser").value,
                                Document: [{
                                    file_id: fileid
                                }],
                                Lead: leadId
                            };
                            const new_Eligibility = ZOHO.CRM.API.insertRecord({
                                Entity: "Eligibility",
                                APIData: new_data,
                                // Trigger: ["workflow"]
                            })
                                .then(function (data) {
                                    console.log(data);
                                    // fetchRecordInfo();
                                    location.reload();
                                    lock_fields();
                                    document.getElementById("cover-spin").style="display:none";
                                });
                        });
                    } else {
                        console.log("empty");
                        var new_data = {
                            Visa_Refusal_from_any_previous_country: document.getElementById("visa_refusal_options").value,
                            From_Which_Country: document.getElementById("ref_country").value,
                            Reason_for_refusal: document.getElementById("reason_for_ref").value,
                            Criminal_History: document.getElementById("crim_history").value,
                            Criminal_History_Details: document.getElementById("crim_his_details").value,
                            Any_medical_issue_allergies: document.getElementById("medi_issues").value,
                            Does_climate_impact_above_health_issues: document.getElementById("climate_details").value,
                            Medical_issue_allergies_details: document.getElementById("med_details").value,
                            Physical_Disability: document.getElementById("phy_dis").value,
                            Physical_Disability_Details: document.getElementById("dis_details").value,
                            Married: document.getElementById("rel_status").value,
                            Have_Kids: document.getElementById("kids_option").value,
                            Kids_Details: document.getElementById("kids_det").value,
                            Any_other_observation: document.getElementById("any_obser").value,
                            Lead: leadId
                        };
                        const new_Eligibility = ZOHO.CRM.API.insertRecord({
                            Entity: "Eligibility",
                            APIData: new_data,
                            // Trigger: ["workflow"]
                        })
                            .then(function (data) {
                                console.log(data);
                                location.reload();
                                document.getElementById("cover-spin").style="display:none";
                            });
                    };

                });
            };
        });
};
function visa_refusal() {
    var x = document.getElementById("visa_refusal_options");
    if (x.value == "Yes") {
        document.getElementById('visa').style = "display:inherit";
    } else if (x.value == "No" || x.value == " ") {
        document.getElementById('visa').style = "display:none";
        document.getElementById('file_name_rule').style = "display:none";
    };
};

function crim_hist() {
    var x = document.getElementById("crim_history");
    if (x.value == "Yes") {
        document.getElementById('criminal').style = "display:inherit";
    } else if (x.value == "No" || x.value == " ") {
        document.getElementById('criminal').style = "display:none";
    };
};

function physical() {
    var x = document.getElementById("phy_dis");
    if (x.value == "Yes") {
        document.getElementById('dis_div').style = "display:inherit";
    } else if (x.value == "No" || x.value == " ") {
        document.getElementById('dis_div').style = "display:none";
    };
};

function relationship_status() {
    var x = document.getElementById("rel_status");
    if (x.value == "Yes") {
        document.getElementById('relationship').style = "display:inherit";
    } else if (x.value == "No" || x.value == " ") {
        document.getElementById('relationship').style = "display:none";
    };
};

function kid_op() {
    var x = document.getElementById("kids_option");
    if (x.value == "Yes") {
        document.getElementById('kids').style = "display:inherit";
    } else if (x.value == "No" || x.value == " ") {
        document.getElementById('kids').style = "display:none";
    };
};

function med_options() {
    var x = document.getElementById("medi_issues");
    if (x.value == "Yes") {
        document.getElementById('med').style = "display:inherit";
    } else if (x.value == "No" || x.value == " ") {
        document.getElementById('med').style = "display:none";
    };
};

function file_name_not_empty() {
    document.getElementById('file_rule').style = "display:none";
    document.getElementById('file_name_rule').style = "display:inherit";
};

function file_name_empty() {
    document.getElementById('file_rule').style = "display:inherit";
    document.getElementById('file_name_rule').style = "display:none";
};
function edit_file(){
    var x = document.getElementById(`file`);
    if(x.value != " "){
        document.getElementById('file_name_rule').style = "display:inherit";

    }else{
         document.getElementById('file_name_rule').style = "display:none";
       

    }
}

var cancel_btn=document.getElementById("cancel");
cancel_btn.addEventListener("click",function cancel_func(e){
    e.preventDefault();
    document.getElementById(`cancel`).hidden = true;
    document.getElementById(`submit`).hidden = true;  
    document.getElementById(`edit_details`).hidden = false;
    fetchRecordInfo();
    lock_fields();
    

      // document.getElementById("form").reset();
})


var edit_btn = document.getElementById("edit_details");
edit_btn.addEventListener("click",function edit_func(){
    edit_file();
    document.getElementById('file_rule').style = "display:inherit";
    document.getElementById("edit_details").hidden = true;
    document.getElementById('visa_refusal_options').style="pointer-events: auto";
    document.getElementById('ref_country').style="pointer-events: auto"; 
    document.getElementById("reason_for_ref").readOnly= false;
    document.getElementById('file').style="pointer-events: auto";
    document.getElementById('crim_history').style="pointer-events: auto";
    document.getElementById('crim_his_details').readOnly= false;
    document.getElementById('medi_issues').style="pointer-events: auto";
    document.getElementById('climate_details').style="pointer-events: auto";
    document.getElementById('med_details').readOnly= false;
    document.getElementById('phy_dis').style="pointer-events: auto";
    document.getElementById('dis_details').readOnly=false;
    document.getElementById('rel_status').style="pointer-events: auto";
    document.getElementById('kids_option').style="pointer-events: auto";
    document.getElementById('kids_det').readOnly = false;
    document.getElementById('any_obser').readOnly = false;
    document.getElementById(`cancel`).hidden = false;
    document.getElementById(`submit`).hidden = false;
});
function lock_fields(){
    document.getElementById('visa_refusal_options').style="pointer-events: none";
    document.getElementById('ref_country').style="pointer-events: none"; 
    document.getElementById("reason_for_ref").readOnly= true;
    document.getElementById('file').style="pointer-events: none";
    document.getElementById('crim_history').style="pointer-events: none";
    document.getElementById('crim_his_details').readOnly= true;
    document.getElementById('medi_issues').style="pointer-events: none";
    document.getElementById('climate_details').style="pointer-events: none";
    document.getElementById('med_details').readOnly= true;
    document.getElementById('phy_dis').style="pointer-events: none";
    document.getElementById('dis_details').readOnly=false;
    document.getElementById('rel_status').style="pointer-events: none";
    document.getElementById('kids_option').style="pointer-events: none";
    document.getElementById('kids_det').readOnly = true;
    document.getElementById('any_obser').readOnly = true;
}
function country_list(){
    
    var select = document.getElementById("ref_country");
    var options =["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
    for (var i =0; i<options.length; i++){
        var opt = options[i];
        
        var el = document.createElement("option");
        el.textContent = opt;
        el.value =opt;
        select.appendChild(el);
   }

}

ZOHO.embeddedApp.init(); 