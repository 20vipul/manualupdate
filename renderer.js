document.addEventListener("DOMContentLoaded", function() {
  const { ipcRenderer } = require('electron');

  let ver = window.location.hash.substring(1);
  document.getElementById("version").innerText = ver;

  document.getElementById("ck_up").addEventListener("click", function() {
    ipcRenderer.send("Check_Update");
  });

  ipcRenderer.on('message', function(event, text) {
    console.log(text.msg);
    if (text.msg === 'Update Available') {
      document.getElementById("updater_container").style.display = "block";
    } else if(text.msg === 'Update Not Available'){
      console.log(text.msg);
    }else if(text.msg ==='Error'){
      console.log(text.error);
    }else if(text.msg ==='progress'){
      console.log("speed : " + text.speed);
      console.log("Download Percent : " + text.dlpercent);
      console.log("Transfered  : " + text.transfered);
      console.log("Total Size : " + text.total);
    }
  });

  document.getElementById("Update_Yes").addEventListener("click", function() {
    ipcRenderer.send("Update_app");

    document.getElementById("Update_Yes").disabled = true
    document.getElementById("Update_No").disabled = true  
    
  });

  document.getElementById("Update_No").addEventListener("click", function() {
    document.getElementById("updater_container").style.display = "none";
  });
});
