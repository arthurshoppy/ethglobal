const req = await fetch("https://api.connect.cometh.io/sponsored-address", {
  headers: { 
    "Content-Type": "application/json",
    "apisecret": "6eaf4a85-110a-4220-bf45-2bb85c5dca6b"
  },
  method: "POST",
  body: JSON.stringify({ "targetAddress": "0x18c8a7ec7897177E4529065a7E7B0878358B3BfF" }),
});

console.log(await req.json())