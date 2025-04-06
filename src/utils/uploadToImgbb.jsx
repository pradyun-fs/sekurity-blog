export const uploadToImgbb = async (file) => {
    const apiKey = "97af36b982d212f8879a941404e1de55"; 
    const formData = new FormData();
    formData.append("image", file);
  
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
  
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };
  