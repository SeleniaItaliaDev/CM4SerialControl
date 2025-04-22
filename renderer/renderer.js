function toggle(on) {
    document.getElementById("status").innerText = "Sending...";
    window.api.ledControl(on)
      .then(res => {
        document.getElementById("status").innerText = res;
      })
      .catch(err => {
        console.error(err);
        document.getElementById("status").innerText = "Error sending command";
      });
  }
  