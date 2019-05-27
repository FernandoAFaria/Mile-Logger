document.getElementById("reset__pw").addEventListener("click", e => {
    e.preventDefault();
    let query = window.location.search.substring(1);
    let password = document.getElementById("password");
    if (password.value === "") {
        password.focus();
    } else {
        let data = {
            token: query,
            pass: password.value
        };
        fetch("https://freemilelog.com/forgot/reset", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(res => {
            console.log(res)
            if(res.status === 200) {
                alert('Password Changed, please try to login.');
                setTimeout(() => {
                    window.location.href = "https://freemilelog.com"
                },1500)
            } else {
                alert("Something Went Wrong!")
            }
        });
    }
});
