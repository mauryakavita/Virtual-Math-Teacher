let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector('#image');
let btn = document.querySelector('button');
let loading = document.querySelector("#loading");
let output = document.querySelector(".output");
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDQgk4iaq1nfSzT_XeFkBWsTy_EGTEbJ70";

let fileDetails = {
    "mime_type": null,
    "data": null
};

async function generateResponse() {
    const RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    { "text": "solve the mathematical problem with proper steps of solution" },
                    {
                        "inline_data": {
                            "mime_type": fileDetails.mime_type,
                            "data": fileDetails.data
                        }
                    }
                ]
            }]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        text.innerHTML = apiResponse;
        output.style.display = "block";
    } catch (e) {
        console.log(e);
    } finally {
        loading.style.display = "none";
    }
}

input.addEventListener("change", (e) => {
    const file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64data = e.target.result.split(",")[1];
        fileDetails.mime_type = file.type;
        fileDetails.data = base64data;

        innerUploadImage.querySelector("span").style.display = "none";
        innerUploadImage.querySelector("#icon").style.display = "none";
        image.style.display = "block";
        image.src = `data:${fileDetails.mime_type};base64,${fileDetails.data}`;
        output.style.display = "none";
    };

    reader.readAsDataURL(file);
});

btn.addEventListener("click", () => {
    loading.style.display = "block";
    generateResponse();
});

innerUploadImage.addEventListener("click", () => {
    input.click();
});
