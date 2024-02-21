const button = document.querySelector("button");

button.addEventListener("click", async () => {
    let tabId = await getCurrentTab();
    let time = document.getElementById("time").value;
    //let button_class = document.getElementById("button_class").value;
    //let id_bool = document.getElementById("select_button").value == "id";
    let reload = document.getElementById("checkbox").checked;

    time = time.split(":");
    let hour = time[0];
    let minute = time[1];
    let d = new Date();
    d.setHours(hour);
    d.setMinutes(minute);
    d.setSeconds(1);
    setDate(d);
    startCountDown();
    let interval = setInterval( async () => {
        if(reload){
            await chrome.scripting.executeScript(
                {
                    target: {tabId: tabId},
                    func: async () => {
                        await location.reload(true);
                    }
                },
            )
        }
        await chrome.scripting.executeScript(
            {
            target: {tabId: tabId, allFrames: true},
            func: executeButtonClick,
            //args: [hour, minute, button_class, id_bool],
            },
            (injectionResults) => {
                for (const frameResult of injectionResults){
                    if(frameResult.result)
                    {
                        clearInterval(interval);
                    }
                }
            }
        );
        //clearInterval(interval);
    }, 1000);

});

const executeButtonClick = () => {
        /*let e = document.getElementsByClassName(button_class);
        if(e.length > 0)
        {
            for(element of e)
            {
                if(element.children.length > 0)
                {
                    element.children[0].click();
                    break;
                }
            }
        }
        var xpath_a = "//a[text()='"+ button_class +"']";
        var xpath_button = "//button[text()='"+ button_class +"']";
        var xpath_input = "//input[value()='"+ button_class +"']";
        var matchingElement_a = document.evaluate(xpath_a, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var matchingElement_button = document.evaluate(xpath_button, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var matchingElement_input = document.find("input[value='"+button_class+"']")[0];//document.evaluate(xpath_input, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(matchingElement_a)
            matchingElement_a.click();
        if(matchingElement_button)
            matchingElement_button.click();
        if(matchingElement_input)
        {
            matchingElement_input.click();
            alert(matchingElement_input)
        }*/
        let warenkorb = document.querySelector("[data-objecttable='local_shopping_cart']");
        if(warenkorb){
            warenkorb.click();
            //alert(true);
            return true;
        }
        return false;

    
}

const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}