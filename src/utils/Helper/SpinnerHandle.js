//loading spinner
export function showLoading() {
  document.getElementById("loadingmsg").style.display = "block";
  document.getElementById("loadingover").style.display = "block";
}
export function stopLoading() {
  document.getElementById("loadingmsg").style.display = "none";
  document.getElementById("loadingover").style.display = "none";
}
export function showLoadingPercentage(progresspercentage) {
  document.getElementById("progresspercentage").innerHTML = "";
  document.getElementById("progresspercentage").innerHTML =
    '<font size="10px" color="white">' + progresspercentage + "%</font>";
  console.log("called " + progresspercentage);
}
