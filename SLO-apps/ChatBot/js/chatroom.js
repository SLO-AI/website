const ChatRoom = function () {
    const chat = document.getElementById("chat");
    const chatHeader = document.getElementById("chat-header");
    let username = "Ik";
    let usernameAgent = "Bot";

    const createMessage = (name, message, me=true) => {
        const el = document.createElement("div");
        const userNameElement = document.createElement("div");
        const timeElement = document.createElement("div");
        const messageElement = document.createElement("div");

        timeElement.innerHTML = new Date().toLocaleTimeString("nl-NL",
            {hour: '2-digit', minute:'2-digit'});
        timeElement.className = "time";

        messageElement.innerHTML = message;
        messageElement.className = "message-content";

        userNameElement.className = "user-name";
        userNameElement.innerHTML = name;

        el.appendChild(userNameElement);
        el.appendChild(messageElement);
        el.appendChild(timeElement);
        el.className = "message";

        if (me)
            el.classList.add("me");

        return el;
    };

    const scrollDown = () => {
        chat.scrollTop = chat.scrollHeight;
    }

    const sanitize = (string) => {
        if (string == null) {
            return string;
        }

        string.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        return string;
    }

    /**
     * Add a message of the user to the chat.
     * @param {string} message Message contents. These will get sanitized before addition.
     */
    this.addMessage = (message) => {
        chat.appendChild(createMessage(username, sanitize(message)));
        scrollDown();
    }

    /**
     * Add a message of the agent to the chat.
     * @param {string} message Message contents. These will get sanitized before addition.
     */
    this.addReply = (message) => {
        chat.appendChild(createMessage(usernameAgent, sanitize(message), false));
        scrollDown();
    }

    /**
     * Clear the chat.
     */
    this.clear = () => {
        for (let i = chat.children.length - 1; i >= 0; i--) {
            chat.removeChild(chat.children[i]);
        }
    }

    /**
     * Set the username of the agent.
     * @param {string} name New username.
     */
    this.setChatName = (name) => {
        usernameAgent = name;
        chatHeader.innerHTML = usernameAgent;
    }

    const init = () => {
        chatHeader.innerHTML = usernameAgent;
    }

    init();
}