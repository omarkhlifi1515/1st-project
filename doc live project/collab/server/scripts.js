document.addEventListener("DOMContentLoaded", () => {
  const http = require("http");
  const express = require("express");
  const setupWS = require("y-websocket/bin/utils").setupWS;

  const app = express();
  const server = http.createServer(app);
  const docArea = document.getElementById("doc-area");
  if (!docArea) return console.error("Could not find #doc-area");

  function format(command, value = null) {
    // Executes the command on the selected text
    document.execCommand(command, false, value);

    // Optional: Re-focus the editor after clicking a button
    document.getElementById("doc-area").focus();
  }

  // Optional: Highlight active buttons based on cursor position
  document
    .getElementById("doc-area")
    .addEventListener("keyup", highlightButtons);
  document
    .getElementById("doc-area")
    .addEventListener("mouseup", highlightButtons);

  function highlightButtons() {
    // Logic to check if current selection is bold/italic and add 'active' class to buttons
    // This requires checking document.queryCommandState(command)
    const buttons = document.querySelectorAll(".toolbar button");
    // Example for Bold:
    if (document.queryCommandState("bold")) {
      // Add active class to bold button logic here
    }
  }

  // serve static client build (optional)
  app.use(express.static("../client/build"));

  // start y-websocket server on same HTTP server
  const wss = setupWS(server, { prefix: "/yjs" });

  server.listen(1234, () => console.log("Server listening on 1234"));
});
