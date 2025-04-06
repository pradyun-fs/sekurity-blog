const imgbbApiKey = "97af36b982d212f8879a941404e1de55"; 
export const handleImagePaste = (editor, imgbbApiKey) => {
    const handlePaste = async (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;
  
      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const file = item.getAsFile();
          if (!file) return;
  
          const formData = new FormData();
          formData.append("image", file);
  
          const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: formData,
          });
  
          const data = await res.json();
          if (data.success) {
            const url = data.data.url;
            editor.chain().focus().insertContent({
              type: "floatingImage",
              attrs: {
                src: url,
                width: 300,
                height: 200,
                caption: "",
              },
            }).run();
          }
        }
      }
    };
  
    return handlePaste;
  };
  