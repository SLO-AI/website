const nav = function () {
    let active_element = "edges2cats";
    let selected_il = "menu-cat"
    const active_class = "active";
    const selected_class = "selected";

    const activate_p2p = function (p2p_element, il_element) {
        document.getElementById(active_element).classList.remove(active_class);
        document.getElementById(p2p_element).classList.add(active_class);

        document.getElementById(selected_il).classList.remove(selected_class);
        document.getElementById(il_element).classList.add(selected_class)
        active_element = p2p_element;
        selected_il = il_element;
    }

    document.getElementById("menu-bag").onclick = () => activate_p2p("edges2handbags", "menu-bag");

    document.getElementById("menu-shoes").onclick = () => activate_p2p("edges2shoes", "menu-shoes");

    document.getElementById("menu-cat").onclick = () => activate_p2p("edges2cats", "menu-cat");

    document.getElementById("menu-buildings").onclick = () => activate_p2p("facades", "menu-buildings");
}


window.addEventListener('load', function () {
    nav();})