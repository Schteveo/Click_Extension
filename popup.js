const button = document.querySelector("button");

button.addEventListener("click", async () => {
    let tabId = await getCurrentTab();
    let time = document.getElementById("time").value;
    let button_class = document.getElementById("button_class").value;
    let id_bool = document.getElementById("select_button").value == "id";
    let reload = document.getElementById("checkbox").checked;

    if(time == "" || button_class == "")
    {
        alert("Wrong usage!\nplease enter a time and button class/id.");
        return;
    }

    time = time.split(":");
    let hour = time[0];
    let minute = time[1];
    let d = new Date();
    d.setHours(hour);
    d.setMinutes(minute);
    d.setSeconds(0);
    setDate(d);
    startCountDown();
    let interval = setInterval( async () => {
        if(reload){
            await chrome.scripting.executeScript(
                {
                    target: {tabId: tabId},
                    func: () => {
                        location.reload();
                    }
                },
            )
        }
        
        let d = new Date();
        if(d.getHours() == hour && d.getMinutes() == minute)
        {
            chrome.scripting.executeScript(
                {
                target: {tabId: tabId},
                func: executeButtonClick,
                args: [hour, minute, button_class, id_bool],
                },
            );
            clearInterval(interval);
        }
    }, 1000);

});

const executeButtonClick = (hour, minute, button_class, id_bool) => {
    if(id_bool){
        document.getElementById(button_class).click();
    }
    else{
        document.getElementsByClassName(button_class)[0].click();
    }
}

const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}