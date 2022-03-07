const load = function() {
    const chatroom = new ChatRoom();
    const bot = new Bot();
    const msg = document.getElementById("chat-input");
    const downloadButton = document.getElementById("download-button");
    const enter = document.getElementById("chat-enter");
    const fileDrop = document.getElementById("file-drop");

    let currentCorpus = null;
    let corpusName = null;

    const loadCorpus = (file, fileName) => {
        console.log("Set corpus");
        currentCorpus = file;
        corpusName = fileName;

        bot.setCorpus(file).then(() => {
            console.log("training corpus");

            bot.trainCorpus().then(() => {
                console.log("Done!");
                chatroom.clear();
                chatroom.setChatName(file.name);
            });
        });
    }

    const sendMessage = () => {
        if (msg.value === null || msg.value.length <= 0) {
            return;
        }

        const content = msg.value;

        chatroom.addMessage(content);
        msg.value = null;

        bot.getReply(content).then(r => {
            chatroom.addReply(r.answer);
        })
    };

    msg.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    function downloadObjectAsJson(){
        if (!currentCorpus)
            return;

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCorpus, null, 2));
        const anchor = document.createElement('a');

        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", corpusName);

        document.body.appendChild(anchor); // required for firefox

        anchor.click();
        anchor.remove();
    }

    downloadButton.addEventListener("click", () => {
        downloadObjectAsJson()
    });

    enter.addEventListener("click", () => {
        sendMessage();
    });

    new DropArea(fileDrop, (files) => {
        console.log(files);
        const fr = new FileReader()

        fr.onload = function(){
            const r = JSON.parse(fr.result)
            loadCorpus(r, fr.name);
        }

        fr.readAsText(files[0]);

    });

    fetch("./chatdata/bol.json").then((r) => {
        r.json().then((r) => {
            loadCorpus(r, "bol.json");
        });

    });
};

window.onload = load;