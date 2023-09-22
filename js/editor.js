var WeaponInfoMain;
var SaveJson;
var SaveRaw;

var IDWeapon;

var SaveEdits;

function editID(ID) {
  IDWeapon = ID;
}

function resetEdits(){
    SaveEdits = {
        "default_edits": {}, 
        "dict_edits": 
        {
            "weapon": {
                "edit": {},
                "remove": new Set()
            }, 
        }
    };
};
//resetEdits();

function loadSave(){
    //resetEdits();
    var playerInfo = SaveJson["client"]["Common"]["Coordinates"];
}

async function onDecryptSave(saveFile){
    document.getElementById("svinfo").innerHTML = "Save loading...";
    SaveRaw = saveFile;
    const response = await fetch('https://flexlion3.herokuapp.com/save/decrypt', {
		method: "POST", 
		body: SaveRaw, 
		headers: {
			"Content-Type": "text/plain"
    	}
	});
    SaveJson = await response.json();
    loadSave();
    document.getElementById("svinfo").innerHTML = "Save loaded!"
    document.getElementById("p1").innerHTML = JSON.stringify(SaveJson, null, 2);
    console.log(SaveJson);
}

async function onDownloadSave(){
    let formData = new FormData();
    downloadFile(JSON.stringify(SaveJson, null, "\t"), "decrypt.json", "text/plain");
}

async function onEditSave(){
    const errorItem = document.getElementById("edit_error");

    console.log(SaveEdits);
    let formData = new FormData();
    formData.append('save', SaveRaw);
    formData.append('edits', JSON.stringify(SaveEdits));
    
    let headers = {};
    
    const response = await fetch('https://flexlion3.herokuapp.com/save/edit', {
		method: "POST", 
		body: formData,
        headers: headers
	  });

    body = await response.blob();

    try {
        errorJson = JSON.parse(await body.text());
        errorItem.textContent = errorJson["error"];
    } catch(error){
        downloadFile(body, "save.dat", "text/plain");
        errorItem.textContent = "";
    }

    resetEdits()
}

function loadWeapons(){
    var validInfos = [];
    for(var i = 0; i < WeaponInfoMain.length; i++){
        if(WeaponInfoMain[i]["Type"] != "Versus") continue; // Only add obtainable weapons
        validInfos.push(WeaponInfoMain[i]);
    }
};

function obtainWeapon(){
    SaveEdits["dict_edits"]["weapon"]["remove"].delete(IDWeapon);
    SaveEdits["dict_edits"]["weapon"]["edit"][IDWeapon] = {
        "TotalPaintTubo": 0,
        "LastPlayDateTimeUtc": 0,
        "RegularWinPoint": 0,
        "RegularWinHighGrade": 0,
        "Exp": 0,
        "Level": 5,
        "RewardAcceptLevel": 0,
        "WinCount": 0
    };
};

function removeWeapon() {
  if(IDWeapon in SaveEdits["dict_edits"]["weapon"]["edit"])
    SaveEdits["dict_edits"]["weapon"]["edit"].delete(IDWeapon); 
  SaveEdits["dict_edits"]["weapon"]["remove"].add(IDWeapon);
  console.log("Removed " + IDWeapon);
}

function downloadFile(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}