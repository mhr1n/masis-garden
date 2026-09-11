const fs = require('fs');
const buf = fs.readFileSync('src/dictionaries/am.json');
// It's UTF-16 LE with BOM (FF FE at start)
const content = buf.slice(2).toString('utf16le');
const obj = JSON.parse(content);

// Fix navigation
obj.navigation.blog = 'Խնամք';

// Add missing category labels
obj.filter.decorLabel = 'Դեկոր';
obj.filter.giftsLabel = 'Նվերներ';
obj.filter.luxLabel = 'Լյուքս';

// Add checkout section if missing (copied from commit history)
if (!obj.checkout) {
  obj.checkout = {
    "title": "Ձևակերպել պատվեր",
    "orderSummary": "Ձեր պատվերը",
    "deliveryDetails": "Առաքման տվյալներ",
    "firstName": "Անուն",
    "lastName": "Ազգանուն",
    "phone": "Հեռախոս",
    "email": "Էլ. փոստ",
    "city": "Քաղաք",
    "address": "Հասցե",
    "addressPlaceholder": "Փողոց, տուն, բնակարան...",
    "sendAsGift": "Ուղարկել որպես նվեր",
    "receiverName": "Ստացողի անուն",
    "cardMessage": "Շնորհավորական բացիկ...",
    "deliveryNote": "Նշում առաքման համար",
    "notePlaceholder": "Հատուկ ցանկություններ...",
    "paymentMethod": "Վճարման եղանակ",
    "paymentOnline": "Առցանց",
    "paymentCash": "Կանխիկ",
    "paymentTransfer": "Փոխանցում",
    "onlineGatewayTitle": "Հայաստանի բանկային դարպաս (Fast Bank)",
    "onlineGatewayDesc": "Կոճակը սեղմելուց հետո կուղղորդվեք անվտանգ բանկային դարպաս (Fast Bank / AmeriaBank / Telcell / Idram) արագ և անվտանգ վճարման համար:",
    "cashDesc": "Կանխիկ կամ քարտով POS տերմինալի միջոցով առաքիչին:",
    "transferDesc": "Բանկային փոխանցում ըստ մանրամասների:",
    "uploadReceipt": "Կցել անդորրագիր:",
    "promoCode": "Promo կոդ",
    "apply": "Կիրառել",
    "discount": "Զեղchurch",
    "cancel": "Չեղարկել",
    "payViaGateway": "Վճարել բանկով",
    "placeOrder": "Կատարել պատվեր",
    "processing": "Ձևակերպում...",
    "orderConfirmed": "Պատվերը հաջողությամբ կատարված է:",
    "thankYouMsg": "Շնորհակալություն: Մեր մենեջերը շուտով կկապվի ձեզ հետ:",
    "continueShopping": "Շարունակել գնումները",
    "invalidPromo": "Անվավեր promo կոդ"
  };
}

const out = JSON.stringify(obj, null, 2);
// Write back as UTF-16 LE with BOM
const outBuf = Buffer.allocUnsafe(2 + out.length * 2);
outBuf[0] = 0xFF;
outBuf[1] = 0xFE;
for (let i = 0; i < out.length; i++) {
  const code = out.charCodeAt(i);
  outBuf[2 + i * 2] = code & 0xFF;
  outBuf[2 + i * 2 + 1] = (code >> 8) & 0xFF;
}
fs.writeFileSync('src/dictionaries/am.json', outBuf);
console.log('Done! blog:', obj.navigation.blog, '| decorLabel:', obj.filter.decorLabel);
