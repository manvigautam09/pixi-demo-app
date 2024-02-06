export function base64ToBlob(base64, mimeType) {
  const byteString = window.atob(base64.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([int8Array], { type: mimeType });
}

export function saveFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  console.log("url, filename");
  console.log(url, filename);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "file-name";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // window.location.href = url;

  URL.revokeObjectURL(url);
}

// export const saveData = (function () {
//   var a = document.createElement("a");
//   document.body.appendChild(a);
//   a.style = "display: none";

//   return function (data, fileName) {
//     var json = JSON.stringify(data),
//       blob = new Blob([json], { type: "octet/stream" }),
//       url = window.URL.createObjectURL(blob);
//     a.href = url;
//     a.download = fileName;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };
// })();
