import { hello } from "../../declarations/hello";

async function toDate(unix_timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(parseInt(unix_timestamp) / 1000000);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime =
        y +
        "/" +
        m +
        "/" +
        d +
        " " +
        hours +
        ":" +
        minutes.substr(-2) +
        ":" +
        seconds.substr(-2);

    return formattedTime;
}

async function post() {
    let post_button = document.getElementById("post");
    post_button.disabled = true;
    document.getElementById("error").innerText = "";
    let textarea = document.getElementById("message");
    let text = textarea.value;
    let otp = document.getElementById("otp").value;
    try {
        await hello.post(otp, text);
        textarea.value = "";
    } catch (error) {
        document.getElementById("error").innerText = "" + error;
    }

    post_button.disabled = false;
}

var num_posts = 0;
async function load_posts() {
    let posts_section = document.getElementById("posts");
    let posts = await hello.posts(0);
    if (num_posts == posts.length) return;
    posts_section.replaceChildren([]);
    num_posts = posts.length;
    for (let i = 0; i < posts.length; i++) {
        const post = document.createElement("p");
        post.innerText =
            "[" +
            (await toDate(posts[i].time)) +
            "] " +
            posts[i].author +
            ": " +
            posts[i].text;
        posts_section.appendChild(post);
    }
}

async function set_name() {
    let name_input = document.getElementById("nameInput");
    let name_button = document.getElementById("nameBtn");
    name_button.disabled = true;
    try {
        await hello.set_name(name_input.value);
        name_input.value = "";
    } catch (error) {
        alert(error);
    }

    name_button.disabled = false;
}

async function load_name() {
    let nameLabel = document.getElementById("name");
    let name = await hello.get_name();
    nameLabel.innerText = name;
}

async function load_timeline(name, str) {
    let timeline_section = document.getElementById("timelines");
    let timelines = await hello.timelineBy(str.toString());
    timeline_section.replaceChildren([]);
    let select = document.getElementById("selectName");
    select.innerText = "[ " + name + " ] " + str;
    for (let i = 0; i < timelines.length; i++) {
        const f = document.createElement("p");
        f.innerText =
            " [" +
            (await toDate(timelines[i].time)) +
            "] " +
            timelines[i].author +
            ": " +
            timelines[i].text;

        timeline_section.appendChild(f);
    }
}

var follow_num = 0;
async function load_follows() {
    let follows = await hello.follows();
    if (follow_num == follows.length) return;
    follow_num = follows.length;

    let follows_section = document.getElementById("follows");
    follows_section.replaceChildren([]);
    for (let i = 0; i < follows.length; i++) { }
    for (let i = 0; i < follows.length; i++) {
        let nameBy = await hello.nameBy(follows[i].toString());
        const f = document.createElement("button");
        f.innerText = "[ " + nameBy + " ]:" + follows[i];
        follows_section.appendChild(f);
        f.onclick = function dofun() {
            f.disabled = true;
            load_timeline(nameBy, follows[i].toString());
            f.disabled = false;
        };
        const b = document.createElement("br");
        follows_section.appendChild(b);
    }
}

async function load() {
    let post_button = document.getElementById("post");
    post_button.onclick = post;
    let nameBtn = document.getElementById("nameBtn");
    nameBtn.onclick = set_name;
    load_posts();
    load_name();
    load_follows();
    // load_timeline();
    setInterval(function () {
        load_posts();
        load_name();
        load_follows();
        // load_timeline();
    }, 3000);
}

window.onload = load;