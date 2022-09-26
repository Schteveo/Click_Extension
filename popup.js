const button = document.querySelector("button");

button.addEventListener("click", async () => {
    let tabId = await getCurrentTab();
    let time = document.getElementById("time").value;
    time = time.split(":");
    let hour = time[0];
    let minute = time[1];
    let d = new Date();
    d.setHours(hour);
    d.setMinutes(minute);
    d.setSeconds(0);
    setDate(d);
    startCountDown();
    let button_class = document.getElementById("button_class").value;
    let id_bool = document.getElementById("select_button").value == "id";
    chrome.scripting.executeScript(
        {
          target: {tabId: tabId},
          func: executeButtonClick,
          args: [hour, minute, button_class, id_bool],
        },
    );
});

const executeButtonClick = (hour, minute, button_class, id_bool) => {
    let intervall = setInterval( () =>
    {
        let d = new Date();
        if(d.getHours() == hour && d.getMinutes() == minute)
        {
            if(id_bool){
                document.getElementById(button_class).click();
            }
            else{
                document.getElementsByClassName(button_class)[0].click();
            }
            clearInterval(intervall);
        }
    }, 1000);
}

const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}