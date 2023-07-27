const btn = document.querySelector(".changecolorbtn");
const colorbox = document.querySelector(".colorGrid");
const colorText = document.querySelector(".colorvalue");
const copid = document.querySelector(".copid");

btn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log(color);
  });
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectionresults) => {
      const [data] = injectionresults;
      if (data.result) {
        const color = data.result.sRGBHex;
        colorbox.style.backgroundColor = color;
        colorText.innerText = color;
        copid.innerText = "Color Copied!";

        try {
          await navigator.clipboard.writeText(color);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
});

async function pickColor() {
  try {
    //picker
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (error) {
    console.error(error);
  }
}
